import { Id } from '@/convex/_generated/dataModel';
import { JWTPayload } from 'jose';
export interface SessionPayload extends JWTPayload {
  userId: string;
  role: string; 
  isVerified: boolean;
  expiresAt:Date
}

export type Post = {
        _id?: Id<"posts">
  authorId: Id<"users">
  content: string
  category: string
  postImage?: string|null
 likes?: number
  updatedAt?: string
        _creationTime?: number
}
export type PostWithAuthor = (Post & { author: User|null|undefined }) | undefined;

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

export interface Comment {
        _id?: Id<"comments">,
        postId: Id<"posts">,
        commentorId: Id<"users">,
        content: string,
        likes: number,
        updatedAt: number,
        _creationTime?:number,
}
export interface CommentWithUser extends Comment {
        user?: User | null;        
}