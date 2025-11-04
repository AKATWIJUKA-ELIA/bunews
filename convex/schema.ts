import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
        posts:defineTable({
                content: v.string(),
                authorId: v.id("users"),
                postImage: v.optional(v.string()),
                category: v.string(),
                likes: v.number(),
                viewsCount: v.optional(v.number()),
                // Do we really need This Reposts Field here?
                reposts: v.optional(v.array(v.object({
                        repostorId: v.string(),
                        timestamp: v.number(),
                }))),
        }).index("byAuthor", ["authorId"])
        .index("byCategory", ["category"]),
        reposts: defineTable({
                reposterId: v.id("users"),
                // Since we can also Repost Comments
                originalPostId: v.id("posts")||v.id("comments"),
                content: v.string(),
                repostImage: v.optional(v.string()),
        }) 
        .index("byOriginalPost", ["originalPostId"])
        .index("byReposter", ["reposterId"]),

        users: defineTable({
    username: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    phoneNumber: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    isVerified: v.boolean(),
    role: v.string(),
    about: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    reset_token: v.optional(v.string()),
    reset_token_expires:v.number(),
    updatedAt: v.number(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"])
  .index("by_username", ["username"])
  .index("by_isVerified", ["isVerified"])
  .index("by_reset_token_expires", ["reset_token_expires"])
  .index("by_reset_token_and_by_reset_token_expires", ["reset_token", "reset_token_expires"]),

  interactions: defineTable({
                userId: v.id("users"),
                postId: v.id("posts"),
                type: v.union(v.literal("view"), v.literal("like"), v.literal("share"), v.literal("comment")),
        }).index("by_user", ["userId"]),

        comments: defineTable({
        postId: v.id("posts"),
        parentCommentId: v.optional(v.id("comments")),
        commentorId: v.id("users"),
        content: v.optional(v.string()),
        commentImages: v.optional(v.array(v.string())),
        likes: v.number(),
        viewsCount:v.optional(v.number()),
        reposts: v.optional(v.array(v.object({
                        repostorId: v.string(),
                        timestamp: v.number(),
                }))),
        updatedAt: v.number(),
        }).index("by_post", ["postId"]),

        followers: defineTable({
                userId: v.id("users"),
                followerId: v.id("users"),
                timestamp: v.number(),
        }).index("by_user", ["userId"]),
});
