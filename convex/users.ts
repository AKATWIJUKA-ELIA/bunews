import {mutation, query} from "./_generated/server"
import { action } from "./_generated/server";
import {v} from "convex/values"
import { ConvexError } from "convex/values";
import { api } from "../convex/_generated/api";
import bcrypt from "bcryptjs";
type Response = {
  success: boolean;
  message: string;
  status: number;
  user:{
        _id: string,
         username: string,
            email: string,
            passwordHash: string,
            phoneNumber?: string,
            profilePicture?: string|null,
            isVerified: boolean,
            role: string,
            reset_token?: string,
            reset_token_expires?:number,
            updatedAt?: number,
            lastLogin?: number,
            _creationTime: number,
  }|null
};

export const CreateUser = mutation({
        args:{
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
        },handler:async(ctx,args)=>{
                try{
                        const existing = await ctx.db
                        .query("users")
                        .withIndex("by_email", (q) => q.eq("email", args.email))
                        .unique();
                        if(existing){
                                return {success:false,message:"This Email Already Exisits",status:400};
                        }
                        const profilePictureUrl = args.profilePicture ? await ctx.storage.getUrl(args.profilePicture) : "";
                const user = await ctx.db.insert("users",{
                        ...args,
                        profilePicture: profilePictureUrl||"",
                }) 
                // await ctx.runMutation(internal.sendEmail.sendEmail,{})
                return {success:true,message:"Success your Account was successfully created ",status:200,user:user};
        }catch{
                        throw new ConvexError({error:"Error creating user",message:"Error creating user",status:500})
                }
                
        }
        })

export const GetUserById = query({
        args:{id: v.id("users")},
              handler: async (ctx, args) => {
                     const Customer = await ctx.db.query("users").filter((q)=> q.eq(q.field("_id"), args.id)).first() 
                    return {...Customer}
                    },
                    })
export const GetUserByEmail = query({
                args:{email:v.string()},
                handler:async(ctx,args)=>{
                        const customer = await ctx.db.query("users")
                        .withIndex("by_email", (q) => q.eq("email", args.email))
                        .unique();
                        if (!customer) {
                               return { success:false ,status: 404,message: "User not Found",user:null };
                        }
                        return { success:true, status: 200, message: "User found", user: {
                                ...customer,
                        } };
                }
                
        })


export const AuthenticateUser = action({
                args:{email:v.string(), password:v.string()},
                handler:async(ctx,args): Promise<Response>=>{
                        const user = await ctx.runQuery(api.users.GetUserByEmail, {
                                email: args.email,
                        });
                        if (!user.success || !user.user) {
                               return { success:false ,status: 404,message: "User not Found",user:user.user };
                        }
                        
                        const isMatch = args.password === user.user?.passwordHash;
                        if (!isMatch) {
                          return { success:false ,status: 401,message: "Invalid Password",user:user.user };
                }
                   return { success:true ,status: 201,message: "Success",user:{...user.user} };
}
})
export const GetUserByToken = query({
                args:{token:v.string()},
                handler:async(ctx,args)=>{
                        
                        const customer = await ctx.db.query("users")
                        .withIndex("by_reset_token_and_by_reset_token_expires", (q) => q
                        .eq("reset_token", args.token)
                        .gt("reset_token_expires", Date.now()))
                        .unique();
                        // console.log("Customer by token:", customer);
                        if (!customer) {
                               return { success:false ,status: 404,message: "User not Found",user:null };
                        }
                        return { success:true, status: 200, message: "User found", user: customer };
                }
                
        })
export const GetCustomerByTokenAction = action({
        args: { token: v.string() },
        handler: async (ctx, args): Promise<Response> => {
    // Call the registered query using ctx.runQuery
    const customer = await ctx.runQuery(api.users.GetUserByToken, { token: args.token });

    if (!customer.user) {
      return { success: false, status: 404, message: "Token is Invalid", user: null };
    }

    return { success: true, status: 200, message: "Success !", user: customer.user };
  },
});

export const UpdateUser = mutation({
         args:{User:v.object({
                _id: v.id("users"),
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
         })},handler:async(ctx,args)=>{
              if(args.User){
              const NewUser = await ctx.db.patch(args.User._id, {
                ...args.User,
                updatedAt: Date.now(),
              });
              return {succes:true, status: 20, message: "Success", user: NewUser};
              }
              
              
        }})