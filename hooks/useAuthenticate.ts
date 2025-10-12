import { useAction  } from "convex/react";
import { api } from "@/convex/_generated/api";
import useSaveUser from "./useSaveUser";
import { UpdateUser } from "@/lib/convex";
import { Id } from '@/convex/_generated/dataModel';

interface UsertoSave {
        User_id: Id<"users">;
        Username: string|"";
         email:string|"";
        profilePicture:string|"",
        about?:string|"",
        bannerImage?:string|"",
}
      type response={
        success:boolean
        message: string
        status:number
        user:{
                _id?: string;
                username: string,
                email: string,
                passwordHash: string,
                phoneNumber?: string,
                profilePicture?: string|null,
                isVerified: boolean,
                about?:string,
                bannerImage?:string,
                role: string,
                reset_token?: string,
                reset_token_expires?:number,
                updatedAt?: number,
                lastLogin?: number,
        } | null
      }
      
const useAuthenticate = () => {
 const saveUser = useSaveUser();
     const authenticate = useAction (api.users.AuthenticateUser);
    const Authenticate = async (email: string | "",password:string) => {
      try {
        
              const res:response = await authenticate({email,password})
        if(!res.success){
                if(res?.status===404){
                        return { success: false, message: res.message};
                }
                if (res?.status === 401) {
                        return { success: false, message: res.message };
                }
        return { success: false, message:"Login failed" };
        }
        const user = res.user;
        
                        try {
                        const usertosave:UsertoSave = { 
                                User_id: user?._id as Id<"users">,
                                Username:user?.username||"",
                                email:user?.email||"",
                                profilePicture:user?.profilePicture||"",
                                about:user?.about||"",
                                bannerImage:user?.bannerImage||"",
                        }
                        await saveUser.saveUser(usertosave)
                          if (user?._id) {
                                                        UpdateUser({
                                                                username: user.username,
                                                                email: user.email,
                                                                passwordHash: user.passwordHash,
                                                                phoneNumber: user.phoneNumber,
                                                                profilePicture: user.profilePicture||null||undefined,
                                                                isVerified: user.isVerified,
                                                                role: user.role,
                                                                _id: user._id as Id<"users">,
                                                                lastLogin: Date.now(),
                                                                reset_token_expires: user.reset_token_expires ?? 0,
                                                                updatedAt: Date.now(),
                                                                
                                                        });
                                                }
                        return { success: true, status: 201, message: 'Success' };
                } catch  {
                        console.error('Error during session creation:');
                        return { success: false, status: 500, message: `Internal Server Error ` };
                }
      } catch {
        return { success: false, message: "Internal Server Error" };
      } 
    };


  return {Authenticate };
};

export default useAuthenticate;