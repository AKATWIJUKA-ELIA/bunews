import {  ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateRepost = mutation({
        args:{
                reposterId: v.id("users"),
                originalPostId: v.id("posts"),
                content: v.string(),
                repostImage: v.optional(v.string()),
        },handler:async(ctx,args)=>{
                try{
                        const { reposterId, originalPostId, content, repostImage} = args;
                        const imageUrl = await ctx.storage.getUrl(repostImage||"");
                const repost = await ctx.db.insert("reposts",{
                        reposterId,
                        originalPostId,
                        content,
                        repostImage: imageUrl||"",
                }) 
                return {success:true,message:"Success your repost was successfully created ",status:200,repost:repost};
        } catch (error) {
                       if (error instanceof ConvexError) {
                               return {success:false,message:error.message,status:500,repost:null};
                       }
                          return {success:false,message:String(error),status:500,repost:null};
                }
                
        }
        })

        export const GetRepostsByUser = query({
                args:{
                        userId: v.id("users"),
                },handler:async(ctx,args)=>{
                        const reposts = await ctx.db.query("reposts").withIndex("byReposter", (q) => q.eq("reposterId", args.userId)).order("desc").collect();
                       const newReposts = await Promise.all(reposts.map((post) => ctx.db.query("posts").filter((q) => q.eq(q.field("_id"), post.originalPostId)).first()
                                .then(async (post) => {
                                        if (!post) return null; // Handle case where post is not found
                                        const repost = reposts.find(r => r && r.originalPostId === post._id);
                                        const reposter = await ctx.db.get(args.userId);
                                        const initialPoster =  await ctx.db.get(post.authorId);
                                        return {
                                                post: {...post,
                                                        postImage: await ctx.storage.getUrl(post.postImage||"")||"",
                                                        author: {
                                                                _id: initialPoster?._id,
                                                                username: initialPoster?.username,
                                                                profilePicture: initialPoster?.profilePicture || "https://www.gravatar.com/avatar/?d=mp"
                                                        }
                                                },
                                                repostContent: {
                                                        content: repost?.content,
                                                        repostImage: repost?.repostImage,
                                                        repostedAt: repost?._creationTime,
                                                        repostedBy: {
                                                                _id: reposter?._id,
                                                                username: reposter?.username,
                                                                profilePicture: reposter?.profilePicture || "https://www.gravatar.com/avatar/?d=mp"
                                                        },
                                                }
                                        };
                                })))
                        console.log("reposts",newReposts);
                        return newReposts;
                }
        })

        export const GetAllReposts = query({
                handler:async(ctx)=>{
                        const reposts = await ctx.db.query("reposts").order("desc").collect();
                        return reposts;
                }
        })