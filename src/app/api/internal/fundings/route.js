import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/core/session";
import { signInternalToken } from "@/lib/core/jwt";

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// ✅ GET — সব funding list দেখাও (যেকোনো logged-in user দেখতে পারবে)
export async function GET() {
    try {
        const res = await fetch(`${backendUrl}/api/fundings`, {
            cache: "no-store",
            headers: {
                "x-internal-secret": process.env.INTERNAL_API_SECRET,
            },
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return NextResponse.json(
                { message: err.message || "Failed to load fundings" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("fundings GET error:", error.message);
        return NextResponse.json({ message: "Failed to load fundings" }, { status: 500 });
    }
}

// ✅ POST — payment success এর পর database এ funding record save করো
export async function POST(request) {
    const session = await getUserSession();

    if (!session?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { amount, donorName, transactionId } = body;

        if (!amount || amount < 1) {
            return NextResponse.json({ message: "Valid amount is required" }, { status: 400 });
        }

        if (!transactionId) {
            return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
        }

        const res = await fetch(`${backendUrl}/api/fundings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_API_SECRET,
                "Authorization": `Bearer ${signInternalToken(session)}`,
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                // ✅ client থেকে আসা donorName ব্যবহার করো
                // session.name fallback হিসেবে রাখো
                donorName: donorName?.trim() || session.name || "Anonymous",
                transactionId,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("fundings POST error:", error.message);
        return NextResponse.json({ message: "Failed to save funding" }, { status: 500 });
    }
}