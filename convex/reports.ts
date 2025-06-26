import { query, mutation, internalAction, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Create a new report
export const createReport = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal("red-flag"), v.literal("intervention")),
    type: v.string(),
    location: v.object({
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const reportId = await ctx.db.insert("reports", {
      ...args,
      userId,
      status: "pending",
    });

    // Create notification for user
    await ctx.db.insert("notifications", {
      userId,
      title: "Report Submitted",
      message: `Your ${args.category} report "${args.title}" has been submitted successfully.`,
      type: "system",
      read: false,
      reportId,
    });

    return reportId;
  },
});

// Get all reports for current user
export const getUserReports = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get media for each report
    const reportsWithMedia = await Promise.all(
      reports.map(async (report) => {
        const media = await ctx.db
          .query("reportMedia")
          .withIndex("by_report", (q) => q.eq("reportId", report._id))
          .collect();

        const mediaWithUrls = await Promise.all(
          media.map(async (item) => ({
            ...item,
            url: await ctx.storage.getUrl(item.storageId),
          }))
        );

        return {
          ...report,
          media: mediaWithUrls,
        };
      })
    );

    return reportsWithMedia;
  },
});

// Get all reports (admin view)
export const getAllReports = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("under-investigation"),
      v.literal("resolved"),
      v.literal("rejected")
    )),
    category: v.optional(v.union(v.literal("red-flag"), v.literal("intervention"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile?.isAdmin) {
      throw new Error("Not authorized");
    }

    let reports;

    if (args.status) {
      reports = await ctx.db
        .query("reports")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else if (args.category) {
      reports = await ctx.db
        .query("reports")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    } else {
      reports = await ctx.db
        .query("reports")
        .order("desc")
        .collect();
    }

    // Get user info and media for each report
    const reportsWithDetails = await Promise.all(
      reports.map(async (report) => {
        const user = await ctx.db.get(report.userId);
        const media = await ctx.db
          .query("reportMedia")
          .withIndex("by_report", (q) => q.eq("reportId", report._id))
          .collect();

        const mediaWithUrls = await Promise.all(
          media.map(async (item) => ({
            ...item,
            url: await ctx.storage.getUrl(item.storageId),
          }))
        );

        return {
          ...report,
          user: user ? { name: user.name, email: user.email } : null,
          media: mediaWithUrls,
        };
      })
    );

    return reportsWithDetails;
  },
});

// Update report status (admin only)
export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(
      v.literal("pending"),
      v.literal("under-investigation"),
      v.literal("resolved"),
      v.literal("rejected")
    ),
    adminComment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user is admin
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile?.isAdmin) {
      throw new Error("Not authorized");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
      adminId: userId,
      adminComment: args.adminComment,
    });

    // Create notification for report owner
    await ctx.db.insert("notifications", {
      userId: report.userId,
      title: "Report Status Updated",
      message: `Your report "${report.title}" status has been updated to ${args.status}.${args.adminComment ? ` Admin comment: ${args.adminComment}` : ""}`,
      type: "status_update",
      read: false,
      reportId: args.reportId,
    });

    // Send email notification
    await ctx.scheduler.runAfter(0, internal.reports.sendStatusUpdateEmail, {
      reportId: args.reportId,
      newStatus: args.status,
    });

    return { success: true };
  },
});

// Delete report (user can only delete pending reports)
export const deleteReport = mutation({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    // Check if user owns the report or is admin
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const isOwner = report.userId === userId;
    const isAdmin = userProfile?.isAdmin;

    if (!isOwner && !isAdmin) {
      throw new Error("Not authorized");
    }

    // Users can only delete pending reports
    if (isOwner && !isAdmin && report.status !== "pending") {
      throw new Error("Can only delete pending reports");
    }

    // Delete associated media
    const media = await ctx.db
      .query("reportMedia")
      .withIndex("by_report", (q) => q.eq("reportId", args.reportId))
      .collect();

    for (const item of media) {
      await ctx.storage.delete(item.storageId);
      await ctx.db.delete(item._id);
    }

    // Delete the report
    await ctx.db.delete(args.reportId);

    return { success: true };
  },
});

// Generate upload URL for media
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Add media to report
export const addReportMedia = mutation({
  args: {
    reportId: v.id("reports"),
    storageId: v.id("_storage"),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    if (report.userId !== userId) {
      throw new Error("Not authorized");
    }

    return await ctx.db.insert("reportMedia", args);
  },
});

export const sendStatusUpdateEmail = internalAction({
  args: { reportId: v.id("reports"), newStatus: v.string() },
  handler: async (ctx, args) => {
    try {
      const reportData = await ctx.runQuery(internal.reports.getReportForEmail, {
        reportId: args.reportId,
      });
      
      if (!reportData?.user?.email) return { success: false };
      
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.CONVEX_RESEND_API_KEY);
      
      await resend.emails.send({
        from: "iReporter <noreply@ireporter.com>",
        to: reportData.user.email,
        subject: `Report Status Updated: ${reportData.title}`,
        html: `<h1>Report Status Updated</h1><p>Your report "${reportData.title}" status: ${args.newStatus}</p>`,
      });
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const getReportForEmail = internalQuery({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) return null;
    
    const user = await ctx.db.get(report.userId);
    return {
      ...report,
      user: user ? { name: user.name, email: user.email } : null,
    };
  },
});
