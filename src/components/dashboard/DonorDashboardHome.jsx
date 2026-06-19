"use client";
import React, { useEffect, useState } from 'react';
import { StatCard } from './StatCard';
import DonationTable from './DonationTable';
// import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function DonorDashboardHome() {
    const { data: session } = useSession();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!session?.user?.email) return;

        const fetchRequests = async () => {
            try {

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-donation-requests?email=${session.user.email}`
                );

                const data = await response.json();

                setRequests(data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();

    }, [session]);

    if (loading) return <div>Loading...</div>;

    // এখানে আমরা হার্ডকোডেড ডাটা দিয়ে স্টেট সেট করছি


    return (
        <div className="p-8 bg-[#FFF8F6] min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome back, Sarah Ahmed!</h1>
                <p className="text-gray-600">You have 2 pending donation requests in your area.</p>
            </div>

            {/* ৪টি কার্ড সেকশন */}
            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Donations" count="12" />
                <StatCard title="Lives Saved" count="36" />
                <StatCard title="Last Donation" count="24 Oct, 2023" />
                <StatCard title="Urgent Needs" count="05" />
            </div>

            {/* Recent Donation Requests টেবিল */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Recent Donation Requests</h2>

                {/* এখানে আমরা ডাটা পাঠাচ্ছি */}
                <DonationTable data={requests} />
            </div>
        </div>
    );
}