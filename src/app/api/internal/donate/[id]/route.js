// src/app/api/internal/donate/[id]/route.js
import { NextResponse } from "next/server";
import { serverMutation } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";

export async function PATCH(request, { params }) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const result = await serverMutation(
            `/api/create-donation-request/donate/${id}`,
            {
                donorName: session.name,
                donorEmail: session.email,
            },
            "PATCH"
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error("donate route error:", error.message);
        return NextResponse.json(
            { message: error.message || "Failed to confirm donation" },
            { status: error.status || 500 }
        );
    }
}