import { useMutation } from "convex/react";
import { Post } from "@/lib/types";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";


export interface UseRepostOptions {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export interface RepostPayload {
  reposterId: Id<"users">;
  originalPostId: Id<"posts">;
  content?: string;
  repostImage?: string|null; // Assume image is first uploaded, and you pass a URL or storageId
}

export function useRepost() {

  const createRepost = useMutation(api.reposts.CreateRepost);
  const [loading, setLoading] = useState(false);

  const repost = async ({ reposterId, originalPostId,content, repostImage }: RepostPayload) => {
    setLoading(true);
    try {
      await createRepost({ reposterId,originalPostId, content: content || "", repostImage: repostImage||"" });
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  return { repost, loading, };
}

export default useRepost;