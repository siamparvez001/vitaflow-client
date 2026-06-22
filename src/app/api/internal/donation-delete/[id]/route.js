import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { signInternalToken } from "@/lib/core/jwt"; // ✅ NEW

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function DELETE(request, { params }) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const res = await fetch(`${baseUrl}/api/create-donation-request/${id}`, {
            method: "DELETE",
            headers: {
                "x-internal-secret": process.env.INTERNAL_API_SECRET,
                "Authorization": `Bearer ${signInternalToken(session)}`, // ✅ NEW
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("donation-delete route error:", error.message);
        return NextResponse.json({ message: "Failed to delete request" }, { status: 500 });
    }
}