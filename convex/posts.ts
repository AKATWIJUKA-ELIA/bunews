import {  ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx)=>{
      return await ctx.storage.generateUploadUrl()
})

export const CreatePost = mutation({
        args:{
                authorId: v.id("users"),
                content: v.string(),
                category: v.string(),
                postImage: v.optional(v.string()),
                likes: v.number(),
        },handler:async(ctx,args)=>{
                try{
                       
                const post = await ctx.db.insert("posts",{
                        ...args,
                        likes: 0
                }) 
                // await ctx.runMutation(internal.sendEmail.sendEmail,{})
                return {success:true,message:"Success your post was successfully created ",status:200,post:post};
        } catch (error) {
                       if (error instanceof ConvexError) {
                               return {success:false,message:error.message,status:500,post:null};
                       }
                       return {success:false,message:String(error),status:500,post:null};
                }
                
        }
        })

                export const GetAllPosts = query({
                handler:async(ctx)=>{
                        const posts = await ctx.db.query("posts").order("desc").collect();
                        const postsWithUrls = await Promise.all(posts.map(async(post)=>{
                                return {
                                        ...post,
                                        postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                                }
                        }))
                        // Randomize order (Fisher–Yates shuffle)
                        // for (let i = postsWithUrls.length - 1; i > 0; i--) {
                        //         const j = Math.floor(Math.random() * (i + 1));
                        //         [postsWithUrls[i], postsWithUrls[j]] = [postsWithUrls[j], postsWithUrls[i]];
                        // }
                        return postsWithUrls;
                }
        })
export const GetPostById = query({
                args:{
                        postId: v.id("posts"),
                },handler:async(ctx,args)=>{
                        const post = await ctx.db.get(args.postId);
                        if(!post){
                                return {success:false,message:"Post not found",status:404,post:null};
                        }
                        const postWithUrl = {
                                ...post,
                                postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                        }
                        return {success:true,message:"Post found",status:200,post:postWithUrl};
                }
        })
export const GetPostsByAuthor = query({
                args:{
                        authorId: v.id("users"),
                },handler:async(ctx,args)=>{
                        const posts = await ctx.db.query("posts")
                        .withIndex("byAuthor", (q) => q.eq("authorId", args.authorId))
                        .order("desc")
                        .collect();
                        const postsWithUrls = await Promise.all(posts.map(async(post)=>{
                                return {
                                        ...post,
                                        postImage: post.postImage ? await ctx.storage.getUrl(post.postImage) : "",
                                }
                        }
                        ))
                        return postsWithUrls;
                }
        })

                export const LikePost = mutation({
                args:{
                        postId:v.id("posts"),
                        userId:v.id("users"),
                },handler:async(ctx,args)=>{
                        const post = await ctx.db.get(args.postId);
                        if(!post){
                                return {success:false,message:"Post not found",status:404,post:null};
                        }
                        const existingInteraction = await ctx.db.query("interactions")
                        .filter((q) => q.and(
                                q.eq(q.field("userId"), args.userId),
                                q.eq(q.field("postId"), args.postId),
                                q.eq(q.field("type"), "like"),
                        ))
                        .unique();
                        if (!existingInteraction) {
                                 const updatedPost = await ctx.db.patch(args.postId,{
                                likes: post.likes+1
                                
                        })
                        await ctx.db.insert("interactions",{
                                        userId: args.userId,
                                        postId: args.postId,
                                        type: "like",
                                })
                        return {success:true,message:"Post updated successfully",status:200,post:updatedPost};
                                
                        }
                        await ctx.db.patch(args.postId,{
                                likes: post.likes-1})
                        await ctx.db.delete(existingInteraction._id);
                        return { success: true, message: "User has disliked this post", status: 200, post: null };
                       
                }
        })
               