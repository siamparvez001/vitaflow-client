// src/app/api/internal/profile/route.js
import { NextResponse } from "next/server";
import { serverMutation } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";

/**
 * Profile আপডেট করার জন্য - client component (UserProfile.jsx) থেকে কল হয়।
 * এই route server-side এ চলে বলে internal secret নিরাপদে ব্যবহার করতে পারে,
 * যেটা browser থেকে সরাসরি সম্ভব না।
 *
 * ব্যবহার (client component থেকে):
 *   fetch('/api/internal/profile', { method: 'PUT', body: JSON.stringify({...}) })
 */
export async function PUT(request) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // ✅ Security: client যেই email পাঠাক না কেন, সবসময় session এর
        // আসল email ব্যবহার করছি - তাই কেউ অন্য কারো প্রোফাইল আপডেট করতে পারবে না।
        const payload = { ...body, email: session.email };

        const result = await serverMutation("/api/profile", payload, "PUT");
        return NextResponse.json(result);
    } catch (error) {
        console.error("profile update route error:", error.message);
        return NextResponse.json(
            { message: error.message || "Failed to update profile" },
            { status: error.status || 500 }
        );
    }
}