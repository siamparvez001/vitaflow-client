
import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/core/server";


export async function GET() {
    try {
       
        const requests = await serverFetch("/api/public-donation-requests");
        return NextResponse.json(requests);
    } catch (error) {
        console.error("public-donation-requests route error:", error.message);
        return NextResponse.json(
            { message: "Failed to load donation requests" },
            { status: 500 }
        );
    }
}