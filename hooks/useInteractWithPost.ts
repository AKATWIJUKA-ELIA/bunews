import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
const useInteractWithPost = () => {
  const likePost = useMutation(api.posts.LikePost);
  const CommentOnPost = useMutation(api.comments.CommentOnPost);

  const likePostFunction = async (postId: Id<"posts">, userId: Id<"users">,) => {
   const response = await likePost({ postId, userId });
        return response; 
};

        const commentOnPostFunction = async (postId: Id<"posts">, userId: Id<"users">, comment: string) => {
        const response = await CommentOnPost({ postId, commentorId: userId, content: comment });
        return response;
        }

  return { 
        likePost: likePostFunction,
        commentOnPost: commentOnPostFunction 
  };
};
export default useInteractWithPost;