import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { signInternalToken } from "@/lib/core/jwt";

export async function GET(request) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "Admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "8";
        const status = searchParams.get("status");

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const secret = process.env.INTERNAL_API_SECRET;

        const query = new URLSearchParams({ page, limit });
        if (status && status !== "All") {
            query.set("status", status);
        }

        const response = await fetch(`${backendUrl}/api/all-users?${query.toString()}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": secret,
                "Authorization": `Bearer ${signInternalToken(session)}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            return NextResponse.json(
                { message: errorBody.message || "Backend error" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("all-users route error:", error.message);
        return NextResponse.json(
            { message: error.message || "Failed to load users" },
            { status: 500 }
        );
    }
}