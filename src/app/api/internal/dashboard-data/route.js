// src/app/api/internal/dashboard-data/route.js
import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { serverFetch } from "@/lib/core/server";

export async function GET(request) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    try {
        if (type === "admin") {
            if (session.role !== "Admin") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            const [usersResult, requestsResult] = await Promise.all([
                serverFetch("/api/all-users?limit=1000"),
                serverFetch("/api/create-donation-request?limit=1000"),
            ]);
            // ✅ FIXED — backend এখন { data, total, page, totalPages } পাঠায়,
            // আগে সরাসরি array পাঠাতো। এখন .data বের করে নিচ্ছি, আর
            // dashboard এর জন্য limit=1000 দিয়ে কল করছি যাতে stats/recent
            // list সব data নিয়ে হিসাব করতে পারে (এটা pagination না,
            // শুধু dashboard summary এর জন্য)।
            return NextResponse.json({
                users: usersResult.data || [],
                requests: requestsResult.data || [],
            });
        }

        if (type === "volunteer") {
            if (session.role !== "Volunteer") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            const requestsResult = await serverFetch("/api/create-donation-request?limit=1000");
            return NextResponse.json({ requests: requestsResult.data || [] });
        }

        if (type === "donor") {
            if (session.role !== "Donor") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            const requestsResult = await serverFetch(
                `/api/my-donation-requests?limit=1000`
            );
            return NextResponse.json({ requests: requestsResult.data || [] });
        }

        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    } catch (error) {
        console.error("dashboard-data route error:", error.message);
        return NextResponse.json(
            { message: "Failed to load dashboard data" },
            { status: 500 }
        );
    }
}