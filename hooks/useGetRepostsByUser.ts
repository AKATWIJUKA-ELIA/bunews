import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";


const useGetRepostsByUser = (id: Id<"users">) => {
    const reposts = useQuery(api.reposts.GetRepostsByUser, id ? { userId:id } : "skip"); // Prevent calling hook with an empty ID

    return {
        data: reposts,
        loading: reposts === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetRepostsByUser;