// src/app/unauthorized/page.jsx
import Link from "next/link";
import { ShieldX } from "lucide-react";

export const metadata = {
    title: "Unauthorized Access | VitaFlow",
};

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCE8E9] px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-rose-100 p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <ShieldX className="h-8 w-8 text-[#7A1C2E]" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Access Denied
                </h1>

                <p className="text-gray-600 mb-8">
                    তোমার একাউন্টের permission এই পেজটা দেখার জন্য যথেষ্ট না।
                    নিজের ড্যাশবোর্ডে ফিরে যাও অথবা হোমপেজে চলে যাও।
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/dashboard"
                        className="w-full rounded-xl bg-[#7A1C2E] text-white font-semibold py-3 hover:bg-[#641724] transition-colors"
                    >
                        Go to my Dashboard
                    </Link>
                    <Link
                        href="/"
                        className="w-full rounded-xl border border-gray-200 text-gray-700 font-semibold py-3 hover:bg-gray-50 transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}