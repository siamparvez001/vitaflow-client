import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { signInternalToken } from "@/lib/core/jwt";

export async function GET(request) {
    try {
        const headersList = await headers();
        const session = await auth.api.getSession({ headers: headersList });

        if (!session || session.user.role !== "Donor") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const secret = process.env.INTERNAL_API_SECRET;

        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "5";
        const status = searchParams.get("status");

        const query = new URLSearchParams({ page, limit });
        if (status) query.set("status", status);

        const response = await fetch(
            `${backendUrl}/api/my-donation-requests?${query.toString()}`,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": secret,
                    "Authorization": `Bearer ${signInternalToken(session.user)}`,
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Backend error:", response.status, errorText);
            return NextResponse.json(
                { message: `Backend error: ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("❌ my-donation-requests route error:", error.message);
        return NextResponse.json(
            { message: error.message || "Failed to load your donation requests" },
            { status: 500 }
        );
    }
}