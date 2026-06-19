import React from 'react';
import UserProfile from './UserProfile';
import { getLoggedInUserProfile } from '@/lib/api/users';

const UserPage = async () => {
    const dbUserData = await getLoggedInUserProfile();
    return (
        <div>
            <UserProfile initialDbData={dbUserData}></UserProfile>
        </div>
    );
};

export default UserPage;