// src/app/api/internal/donation-delete/[id]/route.js
import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

/**
 * Donation request ডিলিট করার জন্য - owner (Donor) অথবা Admin।
 * serverFetch শুধু GET করে, তাই এখানে সরাসরি fetch লিখছি DELETE method দিয়ে।
 */
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
                "x-user-email": session.email,
                "x-user-role": session.role,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("donation-delete route error:", error.message);
        return NextResponse.json(
            { message: "Failed to delete request" },
            { status: 500 }
        );
    }
}