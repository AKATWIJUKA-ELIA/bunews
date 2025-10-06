import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const useGetUserById = (id:  Id<"users">) => {
    const User = useQuery(api.users.GetUserById, id ? { id } : "skip"); 
    return {
        user: User, 
        loading: User === undefined, 
        error: null, 
    };
};

export default useGetUserById;