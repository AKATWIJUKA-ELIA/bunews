import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

export default defineSchema({
        posts:defineTable({
                content: v.string(),
                authorId: v.string(),
                postImages: v.optional(v.array(v.string())),
                category: v.optional(v.string()),
                likes: v.number(),
                comments: v.optional(v.array(v.object({
                        commentorId: v.string(),
                        comment: v.string(),
                        timestamp: v.number(),
                }))),
                reposts: v.optional(v.array(v.object({
                        repostorId: v.string(),
                        timestamp: v.number(),
                }))),
        }).index("byAuthor", ["authorId"])
        .index("byCategory", ["category"]),

        users: defineTable({
    username: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    phoneNumber: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    isVerified: v.boolean(),
    role: v.string(),
    reset_token: v.optional(v.string()),
    reset_token_expires:v.number(),
    updatedAt: v.number(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"])
  .index("by_username", ["username"])
  .index("by_isVerified", ["isVerified"])
  .index("by_reset_token_expires", ["reset_token_expires"])
  .index("by_reset_token_and_by_reset_token_expires", ["reset_token", "reset_token_expires"]),
        
});
