import { serverFetch } from "../core/server";
import { getUserSession } from "../core/session";


export const getUserProfileByEmail = async (email) => {
    if (!email) return null;
    return serverFetch(`/api/profile?email=${email}`); 
}


export const getLoggedInUserProfile = async () => {
    const user = await getUserSession(); 
    
    if (!user?.email) {
        return null;
    }
    
    return getUserProfileByEmail(user.email);
}