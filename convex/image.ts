import { query } from "./_generated/server";
import { v } from "convex/values";

export const getImageUrl = query({
  args: { imageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.imageId);
    return url; // Will be null if not found
  },
});
