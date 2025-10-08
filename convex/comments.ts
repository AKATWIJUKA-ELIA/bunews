import {  v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const CommentOnPost = mutation({
                args:{
                        postId:v.id("posts"),
                        commentorId:v.id("users"),
                        content:v.string(),
                },handler:async(ctx,args)=>{
                        try{
                        const comment = await ctx.db.insert("comments",{
                                ...args,
                                likes:0,
                                updatedAt:Date.now(),
                        }) 
                        return {success:true,message:"Comment added successfully",status:200,comment:comment};
                }catch{
                        return {success:false,message:"Error adding comment",status:500,comment:null};
                }}}) 

export const GetCommentsByPost = query({
        args:{
                postId: v.id("posts"),
        },handler:async(ctx,args)=>{
                const comments = await ctx.db.query("comments")
                .withIndex("by_post", (q) => q.eq("postId", args.postId))
                .collect();
                return comments;
        }})