import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { signInternalToken } from "@/lib/core/jwt";

export async function PATCH(request, { params }) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "Admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { userId } = await params;

    try {
        const body = await request.json();
        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

        const res = await fetch(`${backendUrl}/api/all-users/role/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET,
                "Authorization": `Bearer ${signInternalToken(session)}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("user-role route error:", error.message);
        return NextResponse.json({ message: "Failed to update role" }, { status: 500 });
    }
}