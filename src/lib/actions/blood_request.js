// "use server"

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// export const bloodRequest = async (bloodRequestData) => {
//     const res = await fetch(`${baseUrl}/api/create-donation-request`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(bloodRequestData)
//     })
//     if (!res.ok) {
//         throw new Error(`HTTP Error: ${res.status}`);
//     }

//     return res.json();
// }




"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const internalSecret = process.env.INTERNAL_API_SECRET;

export const bloodRequest = async (bloodRequestData) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("User not authenticated");
    }

    console.log("🔍 Debug - Session User:", {
        email: session.user.email,
        role: session.user.role,
        status: session.user.status,
    });

    const res = await fetch(`${baseUrl}/api/create-donation-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': internalSecret,
            'x-user-email': session.user.email,
            'x-user-role': session.user.role,
        },
        body: JSON.stringify(bloodRequestData)
    });

    const data = await res.json();
    
    console.log("🔍 Debug - Response:", { 
        status: res.status, 
        message: data.message,
        data 
    });

    if (!res.ok) {
        // ✅ এখানে error message আসবে
        throw new Error(data.message || `HTTP Error: ${res.status}`);
    }

    return data;
}