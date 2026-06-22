import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        console.log("🔄 [Status Update] ID:", id, "Status:", status);

        if (!id || !status) {
            return NextResponse.json(
                { message: "ID and status are required" },
                { status: 400 }
            );
        }

        const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const secret = process.env.INTERNAL_API_SECRET;

        const response = await fetch(
            `${backendUrl}/api/create-donation-request/status/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": secret,
                },
                body: JSON.stringify({ status }),
            }
        );

        console.log("📡 Backend response:", response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error("❌ Backend error:", error);
            return NextResponse.json(
                { message: "Failed to update status", error },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("✅ Status updated");
        return NextResponse.json(data);

    } catch (error) {
        console.error("❌ Route error:", error.message);
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}