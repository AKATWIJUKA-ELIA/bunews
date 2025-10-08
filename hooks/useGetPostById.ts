import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { getUserById } from "@/lib/convex";
import { useEffect, useState } from "react";

export interface User {
        _id?: Id<"users">|undefined,
        username?: string|undefined,
        email?: string|undefined,
        passwordHash?: string|undefined,
        phoneNumber?: string,
        profilePicture?: string|undefined|null,
        isVerified?: boolean | false|undefined,
        role?: string|"",
        reset_token?:string|undefined
        reset_token_expires?:number|undefined,
        updatedAt?: number|undefined,
        lastLogin?: number,
        _creationTime?:number,
}

const useGetPostById = (id: Id<"posts">) => {
    const post = useQuery(api.posts.GetPostById, id ? { postId:id } : "skip"); // Prevent calling hook with an empty ID
    const [author,setauthor] = useState<User|null>(null); 
    useEffect(() => {
        if (!post?.post?.authorId) return;
        const fetchAuthor = async() => {
                await getUserById(post?.post?.authorId as Id<"users">).then((res)=>{
                        if(res?.user ){
                                setauthor(res.user);
                        }
                })
        };
        fetchAuthor();
    }, [post]);
    const postWithAuthor = {
        ...post?.post, 
        author:author };

    return {
        data: post?.post,
        postWithAuthor:postWithAuthor,
        loading: post === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetPostById;