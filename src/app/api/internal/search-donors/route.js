// src/app/api/internal/search-donors/route.js (update করো)

import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/core/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const district = searchParams.get('district');
    const upazila = searchParams.get('upazila');

    console.log("📍 Internal route received params:", { bloodGroup, district, upazila });

    const query = new URLSearchParams();
    if (bloodGroup) query.append('bloodGroup', bloodGroup);
    if (district) query.append('district', district);
    if (upazila) query.append('upazila', upazila);

    const queryString = query.toString();
    console.log("🔗 Calling backend with query:", queryString);

    try {
        const donors = await serverFetch(`/api/search-donors?${queryString}`);
        console.log("✅ Backend response:", donors);
        return NextResponse.json(donors);
    } catch (error) {
        console.error("❌ search-donors route error:", error.message);
        console.error("Full error:", error);
        return NextResponse.json(
            { message: "Failed to search donors", error: error.message },
            { status: 500 }
        );
    }
}