import AsyncStorage from "@react-native-async-storage/async-storage";

import { Id } from "@/convex/_generated/dataModel";
interface User {
        User_id: Id<"users">;
        Username: string;
         email:string;
        profilePicture:string,
}
const useLogOut = ()=>{
        const signOut = async ()=>{
        const save = await AsyncStorage.removeItem('user');
        return save;
}
        return {signOut};
}

export default useLogOut