import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const useGetPostById = (id: Id<"posts">) => {
    const post = useQuery(api.posts.GetPostById, id ? { postId:id } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: post?.post, 
        loading: post === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetPostById;