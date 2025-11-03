import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const useGetAllReposts = () => {
    const reposts = useQuery(api.reposts.GetAllReposts);

    return {
        data: reposts,
        loading: reposts === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetAllReposts;