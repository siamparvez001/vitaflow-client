import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signInternalToken } from "@/lib/core/jwt"; // ✅ NEW

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        if (!id || id === "undefined" || id === "") {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const secret = process.env.INTERNAL_API_SECRET || "";

        const response = await fetch(
            `${backendUrl}/api/create-donation-request/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": secret,
                    "Authorization": `Bearer ${signInternalToken(session.user)}`, // ✅ NEW
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { message: `Backend error: ${response.status}`, error: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("❌ Route error:", error.message);
        return NextResponse.json(
            { message: "Failed to fetch request detail", error: error.message },
            { status: 500 }
        );
    }
}