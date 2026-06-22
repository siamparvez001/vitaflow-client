import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signInternalToken } from "@/lib/core/jwt"; // ✅ NEW

export async function GET(request) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session || session.user.role !== "Admin") {
            return NextResponse.json({ message: "Unauthorized: Admin only" }, { status: 403 });
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/stats`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
                    "Authorization": `Bearer ${signInternalToken(session.user)}`, // ✅ NEW
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("❌ Stats route error:", error.message);
        return NextResponse.json(
            { message: "Failed to fetch stats", error: error.message },
            { status: 500 }
        );
    }
}