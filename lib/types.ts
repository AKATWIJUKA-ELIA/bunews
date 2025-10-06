import { Id } from '@/convex/_generated/dataModel';
import { JWTPayload } from 'jose';
export interface SessionPayload extends JWTPayload {
  userId: string;
  role: string; 
  isVerified: boolean;
  expiresAt:Date
}

export type Post = {
  title: string
  authorId: Id<"users">
  excerpt: string
  content: string
  category: string
  postImage: string
  upvotes?: number
  downvotes?: number
  updatedAt?: string
}

export interface User {
        _id: Id<"users">,
        username: string,
        email: string,
        passwordHash: string,
        phoneNumber?: string,
        profilePicture?: string,
        isVerified: boolean | false,
        role: string|"",
        reset_token?:string
        reset_token_expires:number,
        updatedAt: number,
        lastLogin?: number,
        _creationTime?:number,
}
export interface UpstreamUser {
        _id: Id<"users">,
        username: string,
        email: string,
        passwordHash: string,
        phoneNumber?: string,
        profilePicture?: string,
        isVerified: boolean | false,
        role: string|"",
        reset_token?:string
        reset_token_expires:number,
        updatedAt: number,
        lastLogin?: number,
}

export interface UserProfile {
        userId: string;
        role: string; 
        isVerified: boolean;
        expiresAt:Date
}