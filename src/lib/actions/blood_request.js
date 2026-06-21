"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
            'x-user-email': session.user.email,
            'x-user-role': session.user.role,
        },
        body: JSON.stringify(bloodRequestData)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || `HTTP Error: ${res.status}`);
    }

    return data;
}