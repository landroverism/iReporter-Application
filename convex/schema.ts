import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  reports: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal("red-flag"), v.literal("intervention")),
    type: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("under-investigation"), 
      v.literal("resolved"),
      v.literal("rejected")
    ),
    location: v.object({
      address: v.string(),
      latitude: v.number(),
      longitude: v.number(),
    }),
    userId: v.id("users"),
    adminId: v.optional(v.id("users")),
    adminComment: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_admin", ["adminId"]),

  reportMedia: defineTable({
    reportId: v.id("reports"),
    storageId: v.id("_storage"),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    fileName: v.string(),
  })
    .index("by_report", ["reportId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal("status_update"), v.literal("system")),
    read: v.boolean(),
    reportId: v.optional(v.id("reports")),
  })
    .index("by_user", ["userId"])
    .index("by_read", ["read"]),

  userProfiles: defineTable({
    userId: v.id("users"),
    phoneNumber: v.optional(v.string()),
    isAdmin: v.boolean(),
    bio: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_admin", ["isAdmin"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
