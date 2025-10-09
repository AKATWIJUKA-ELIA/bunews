import { mutation } from "./_generated/server";
import { v } from "convex/values";
import api from "./_generated/api";

export const FollowUser = mutation({
        args: {
                userId: v.id("users"),
                followerId: v.id("users"),},
        handler: async (ctx, args) => {
                try {
                        const existingFollow = await ctx.db
                                .query("followers")
                                .filter((q)=> q.and(
                                        q.eq(q.field("userId"), args.userId),
                                        q.eq(q.field("followerId"), args.followerId),
                                ))
                                .unique();
                        if (existingFollow) {
                                await ctx.db.delete(existingFollow._id);
                                return { success: true, message: "Unfollowed user successfully", status: 200 };
                        }
                        await ctx.db.insert("followers", {
                                userId: args.userId,
                                followerId: args.followerId,
                                timestamp: Date.now(),
                        });
                        return { success: true, message: "Followed user successfully", status: 200 };
                } catch (error) {
                        return { success: false, message: "Error following user", status: 500 };
                }}
});