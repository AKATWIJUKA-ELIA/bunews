import { useMutation } from "convex/react";
import { Post } from "@/lib/types";
import { api } from "@/convex/_generated/api";
const useCreatePost = () => {
        const create = useMutation(api.posts.CreatePost);

        const CreatePost = async (Post:Post) =>{
                try{
                const response = await create({
                        authorId: Post.authorId,
                        content: Post.content,
                        category: Post.category,
                        postImage: Post.postImage||null||"",
                        likes: 0,
                });
                 if(!response?.success){
                        return { success: false, message: response.message ,  status: 400 };
                }
                return { success: true, message:response.message ,status: 200 };
                }catch{
                        return { success: false, message: "Sorry,  Can not upload at this time please try again later"  , status: 500}
                        
                }
        }
        return { CreatePost };
 }
 export default useCreatePost;