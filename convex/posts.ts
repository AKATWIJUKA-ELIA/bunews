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