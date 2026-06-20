"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import RecentDonationRequests from './RecentDonationRequests';
import { useSession } from "@/lib/auth-client";

export default function DonorDashboardHome() {
    const { data: session } = useSession();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchRequests = async () => {
            try {
                const response = await fetch(
                    `${baseUrl}/api/my-donation-requests?email=${session.user.email}`
                );

                const data = await response.json();

                setRequests(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [session]);

    // ✅ real `requests` ডাটা থেকে stats বের করা হচ্ছে
    const stats = useMemo(() => {
        // ✅ FIX: status এখন backend এ default "Pending", আগে ভুলভাবে "Active" দিয়ে ফিল্টার হচ্ছিল
        const pendingCount = requests.filter((r) => r.status === "Pending").length;

        const sortedByDate = [...requests].sort(
            (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
        );

        const lastDonation = sortedByDate[0]?.donationDate
            ? new Date(sortedByDate[0].donationDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : "N/A";

        return {
            totalRequests: requests.length,
            pendingCount,
            lastDonation,
        };
    }, [requests]);

    if (loading) return <div>Loading...</div>;

    // ✅ session থেকে real নাম, hardcoded "Sarah Ahmed" এর বদলে
    const userName = session?.user?.name || "Donor";

    return (
        <div className="p-8 bg-[#FFF8F6] min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome back, {userName}!</h1>
                <p className="text-gray-600">
                    You have {stats.pendingCount} pending donation requests in your area.
                </p>
            </div>

            {/* ৪টি কার্ড সেকশন — এখন real ডাটা থেকে আসছে */}
            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Requests" count={stats.totalRequests} />
                <StatCard title="Pending Requests" count={stats.pendingCount} />
                <StatCard title="Last Donation" count={stats.lastDonation} />
                {/*
                  ⚠️ "Lives Saved" এর জন্য বর্তমান backend schema তে কোনো field নেই।
                  পরে backend এ এই field/collection যোগ করলে এখানে বসিয়ে দিও।
                */}
                <StatCard title="Lives Saved" count="—" />
            </div>

            {/* ✅ প্রথম ৩টা donation request + See More বাটন */}
            <RecentDonationRequests data={requests} limit={3} />
        </div>
    );
}