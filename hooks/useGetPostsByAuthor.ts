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

const useGetPostsByAuthor = (id: Id<"users">) => {
    const posts = useQuery(api.posts.GetPostsByAuthor, id ? { authorId:id } : "skip"); // Prevent calling hook with an empty ID
    const [author,setauthor] = useState<User|null>(null); 
    useEffect(() => {
        
        const fetchAuthor = async() => {
                await getUserById(id as Id<"users">).then((res)=>{
                        if(res?.user ){
                                setauthor(res.user);
                        }
                })
        };
        fetchAuthor();
    }, [posts]);
    const postsWithAuthor = posts?.map((post) => ({
        ...post,
        author: author
    })) || [];
    console.log("postsWithAuthor", postsWithAuthor);
    

    return {
        data: posts,
        postWithAuthor:postsWithAuthor,
        loading: posts === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetPostsByAuthor;