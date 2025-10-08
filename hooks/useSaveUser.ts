import AsyncStorage from "@react-native-async-storage/async-storage";

import { Id } from "@/convex/_generated/dataModel";
interface User {
        User_id: Id<"users">;
        Username: string;
         email:string;
        profilePicture:string,
}
const useSaveUser = ()=>{
        const saveUser = async (user:User)=>{
        const save = await AsyncStorage.setItem('user', JSON.stringify(user));
        return save;
}
        return {saveUser};
}

export default useSaveUser