import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";



const useGetAllPosts = () => {
    const posts = useQuery(api.posts.GetAllPosts); 

    return {
        data: posts, 
        loading: posts === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetAllPosts;