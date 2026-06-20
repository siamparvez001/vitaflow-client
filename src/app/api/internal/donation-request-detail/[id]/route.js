// src/app/api/internal/donation-request-detail/[id]/route.js
import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";


export async function GET(request, { params }) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const result = await serverFetch(`/api/create-donation-request/${id}`);
        return NextResponse.json(result);
    } catch (error) {
        console.error("donation-request-detail route error:", error.message);
        return NextResponse.json(
            { message: error.message || "Request not found" },
            { status: error.status || 404 }
        );
    }
}