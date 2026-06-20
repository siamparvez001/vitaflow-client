// src/lib/core/session.js
import { headers } from "next/headers";
import { auth } from "../auth";

/**
 * Better Auth session থেকে logged-in user এর basic info বের করে।
 * রিটার্ন করে: { email, role, name, ... } অথবা null যদি লগইন না থাকে।
 */
export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user || null;
};