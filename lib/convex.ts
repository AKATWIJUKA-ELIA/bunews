import {User,UpstreamUser} from "@/lib/types"
"use server";
import {ConvexClient} from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

if (!process.env.EXPO_PUBLIC_CONVEX_URL) {
  throw new Error("CONVEX_URL is not defined");
}
const convex = new ConvexClient(process.env.EXPO_PUBLIC_CONVEX_URL);

export async function UpdateUser(userToUpdate: UpstreamUser | null) {
    if (!userToUpdate) {
        return { success: false, message: "No user provided" };
    }
    try {
        await convex.mutation(api.users.UpdateUser, { User: userToUpdate });
        return { success: true, message: "User updated successfully" };
    } catch (e) {
        return { success: false, message: e instanceof Error ? e.message : "Unknown error" };
    }
}
export const getUserByToken = async (token: string) => {
    try {
        const user = await convex.query(api.users.GetUserByToken, { token });
        if (!user.success || !user.user) {
            return { success: false, message: "User not found", status: 404 };
        }
        return { success: true, user: user.user };
    } catch (error) {
        console.error("Error fetching user by token:", error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}
export async function getUserById(id:  Id<"users">) {
  if (!id) return { user: null, loading: false, error: "No ID provided" };
  try {
    const user = await convex.query(api.users.GetUserById, { id });
    return {
      user,
    };
  } catch (e) {
    return {
      user: null,
      loading: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
