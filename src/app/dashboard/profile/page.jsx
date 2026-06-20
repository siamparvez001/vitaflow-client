// src/app/dashboard/profile/page.jsx
import { requireAuth } from "@/lib/actions/roleCheck";
import UserProfile from "./UserProfile";
import { getLoggedInUserProfile } from "@/lib/api/users";

const UserPage = async () => {
    // ✅ Role matter করে না, শুধু লগইন থাকলেই হবে।
    await requireAuth();

    const dbUserData = await getLoggedInUserProfile();
    return (
        <div>
            <UserProfile initialDbData={dbUserData} />
        </div>
    );
};

export default UserPage;