import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/convex";
import { CommentWithUser } from '@/lib/types';

const useGetRepliesToComment = (id:Id<"comments">) => {
    const comments = useQuery(api.comments.GetRepliesByComment,{parentCommentId:id});
        const [commentsWithCommentors, setCommentsWithCommentors] = useState<CommentWithUser[]>([]);
        useEffect(() => {
  const fetchComments = async () => {
    const enrichedComments = await Promise.all(
      comments?.map(async (comment) => {
        const res = await getUserById(comment.commentorId);
        return {
          ...comment,
          user: res.user,
        };
      }) || []
    );
    setCommentsWithCommentors(enrichedComments as CommentWithUser[] );
  };
  fetchComments();
}, [comments]);
    return {
        data: comments,
        commentsWithAuthors:commentsWithCommentors,
        loading: comments === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetRepliesToComment;