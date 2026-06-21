// src/app/api/internal/donation-status/[id]/route.js
import { NextResponse } from "next/server";
import { serverMutation } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";

/**
 * Donation request এর status আপডেট করার জন্য (pending -> inprogress -> done/canceled)।
 * owner (Donor), Admin, অথবা Volunteer ব্যবহার করতে পারবে - role/ownership
 * check Express সাইডে হয়।
 */
export async function PATCH(request, { params }) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const result = await serverMutation(
            `/api/create-donation-request/status/${id}`,
            body,
            "PATCH"
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error("donation-status route error:", error.message);
        return NextResponse.json(
            { message: error.message || "Failed to update status" },
            { status: error.status || 500 }
        );
    }
}