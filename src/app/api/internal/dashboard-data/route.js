// src/app/api/internal/dashboard-data/route.js
import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { serverFetch } from "@/lib/core/server";

/**
 * Client component গুলো (AdminDashboardHome.jsx, VolunteerDashboardHome.jsx,
 * DonorDashboardHome.jsx) সরাসরি Express কে কল করতে পারবে না কারণ ব্রাউজারের
 * কাছে internal secret থাকা নিরাপদ না।
 *
 * তাই এই route টা মাঝখানে বসে - browser এই Next.js route কে কল করে (যেটা
 * নিরাপদ, কারণ এটা server-side এ চলে), আর এই route ভিতরে গিয়ে serverFetch
 * দিয়ে Express কে কল করে secret সহ।
 *
 * ব্যবহার (client component থেকে):
 *   fetch('/api/internal/dashboard-data?type=admin')
 *   fetch('/api/internal/dashboard-data?type=volunteer')
 *   fetch('/api/internal/dashboard-data?type=donor')
 */
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
            const [users, requests] = await Promise.all([
                serverFetch("/api/all-users"),
                serverFetch("/api/create-donation-request"),
            ]);
            return NextResponse.json({ users, requests });
        }

        if (type === "volunteer") {
            if (session.role !== "Volunteer") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            const requests = await serverFetch("/api/create-donation-request");
            return NextResponse.json({ requests });
        }

        if (type === "donor") {
            if (session.role !== "Donor") {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
            const requests = await serverFetch(
                `/api/my-donation-requests?email=${session.email}`
            );
            return NextResponse.json({ requests });
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