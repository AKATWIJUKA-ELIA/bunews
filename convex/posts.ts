import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx)=>{
      return await ctx.storage.generateUploadUrl()
})

export const CreatePost = mutation({
        args:{
                authorId: v.id("users"),
                title: v.string(),
                content: v.string(),
                excerpt: v.string(),
                category: v.string(),
                postImage: v.string(),
                upvotes: v.number(),
                downvotes: v.number(),
        },handler:async(ctx,args)=>{
                try{
                       
                const post = await ctx.db.insert("posts",{
                        ...args,
                        likes: 0
                }) 
                // await ctx.runMutation(internal.sendEmail.sendEmail,{})
                return {success:true,message:"Success your post was successfully created ",status:200,post:post};
        }catch{
                       return {success:false,message:"Error creating post",status:500,post:null};
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