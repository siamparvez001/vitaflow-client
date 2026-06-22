// /src/lib/actions/blood_request.js
"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { signInternalToken } from "@/lib/core/jwt"; // ✅ NEW

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
const internalSecret = process.env.INTERNAL_API_SECRET;

export const bloodRequest = async (bloodRequestData) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("User not authenticated");
    }

    const res = await fetch(`${baseUrl}/api/create-donation-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-secret': internalSecret,
            'Authorization': `Bearer ${signInternalToken(session.user)}`, // ✅ NEW
        },
        body: JSON.stringify(bloodRequestData)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || `HTTP Error: ${res.status}`);
    }

    return data;
}