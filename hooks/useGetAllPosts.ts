import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { PostWithAuthor } from "@/lib/types";
import { getUserById } from "@/lib/convex";

import { useEffect, useState } from "react";

const useGetAllPosts = () => {
    const posts = useQuery(api.posts.GetAllPosts);
    const [postsWithAuthors, setPostsWithAuthors] = useState<PostWithAuthor[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchAuthors = async () => {
            if (!posts) {
                setPostsWithAuthors(undefined);
                setLoading(true);
                return;
            }
            setLoading(true);
            const postsWithAuthorsData = await Promise.all(
                posts.map(async post => {
                    const authorResult = await getUserById(post.authorId);
                    // getUserById may return { user, loading, error }
                    return {
                        ...post,
                        author: authorResult?.user ?? null
                    };
                })
            );
            if (!cancelled) {
                setPostsWithAuthors(postsWithAuthorsData);
                setLoading(false);
            }
        };
        fetchAuthors();
        return () => {
            cancelled = true;
        };
    }, [posts]);

    return {
        postsWithAuthors,
        JustPosts: posts,
        loading: loading || posts === undefined, // Convex returns `undefined` while loading
        error: null, // Convex doesn't provide an explicit error, so handle it elsewhere if needed
    };
};

export default useGetAllPosts;