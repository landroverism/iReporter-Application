import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user profile
export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      ...user,
      profile,
    };
  },
});

// Create or update user profile
export const updateUserProfile = mutation({
  args: {
    phoneNumber: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, args);
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", {
        userId,
        isAdmin: false,
        ...args,
      });
    }
  },
});

// Make user admin (for development/setup)
export const makeUserAdmin = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user is already admin
    const currentUserProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", currentUserId))
      .first();

    // For initial setup, allow if no admins exist yet
    const adminCount = await ctx.db
      .query("userProfiles")
      .withIndex("by_admin", (q) => q.eq("isAdmin", true))
      .collect();

    if (adminCount.length > 0 && !currentUserProfile?.isAdmin) {
      throw new Error("Not authorized");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, { isAdmin: true });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", {
        userId: args.userId,
        isAdmin: true,
      });
    }
  },
});

// Auto-promote specific admin email
export const checkAndPromoteAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "vocalunion8@gmail.com") {
      return null;
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile && !existingProfile.isAdmin) {
      await ctx.db.patch(existingProfile._id, { isAdmin: true });
      return existingProfile._id;
    } else if (!existingProfile) {
      return await ctx.db.insert("userProfiles", {
        userId,
        isAdmin: true,
      });
    }

    return existingProfile?._id || null;
  },
});
