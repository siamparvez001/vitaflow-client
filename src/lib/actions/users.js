
// actions/users.js

import { serverFetch } from "../core/server";

export const getAllUsers = async () => {
    // ব্যাকএন্ডের অল-ইউজার এপিআইতে হিট করা হচ্ছে
    return serverFetch(`/api/all-users`);
}