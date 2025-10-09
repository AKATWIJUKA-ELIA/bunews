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
                const repost = await ctx.db.insert("reposts",{
                        reposterId,
                        originalPostId,
                        content,
                        repostImage: repostImage||"",
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