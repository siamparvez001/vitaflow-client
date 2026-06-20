"use client";
import Link from "next/link";
import { Button } from "@heroui/react";

const statusStyles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
};

export default function RecentDonationRequests({ data = [], limit = 3 }) {
    const items = data.slice(0, limit);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Donation Requests</h2>
                <Link href="/dashboard/all-blood-donation-request">
                    <Button variant="light" className="text-[#800020] font-semibold">
                        See More →
                    </Button>
                </Link>
            </div>

            {items.length === 0 ? (
                <p className="text-gray-500 text-sm">No donation requests found.</p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {items.map((req) => {
                        const status = req.status || "Pending";
                        const badgeClass =
                            statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200";

                        return (
                            <div
                                key={req._id}
                                className="py-4 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-bold text-gray-900">
                                        {req.recipientName || "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {req.bloodGroup} • {req.hospitalName || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {req.donationDate || "N/A"}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-xs font-bold rounded-full border whitespace-nowrap ${badgeClass}`}
                                >
                                    {status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}