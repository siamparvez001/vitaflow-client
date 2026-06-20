"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import RecentDonationRequests from './RecentDonationRequests';
import { useSession } from "@/lib/auth-client";

export default function DonorDashboardHome() {
    const { data: session } = useSession();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.email) return;

        const fetchRequests = async () => {
            try {
                // ✅ Express কে সরাসরি না কল করে নিজের Next.js internal route কল করছি
                const res = await fetch("/api/internal/dashboard-data?type=donor");

                if (!res.ok) {
                    throw new Error("Failed to fetch donor dashboard data");
                }

                const { requests: data } = await res.json();
                setRequests(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [session]);

    const stats = useMemo(() => {
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

    const userName = session?.user?.name || "Donor";

    return (
        <div className="p-8 bg-[#FFF8F6] min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome back, {userName}!</h1>
                <p className="text-gray-600">
                    You have {stats.pendingCount} pending donation requests in your area.
                </p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Requests" count={stats.totalRequests} />
                <StatCard title="Pending Requests" count={stats.pendingCount} />
                <StatCard title="Last Donation" count={stats.lastDonation} />
                <StatCard title="Lives Saved" count="—" />
            </div>

            <RecentDonationRequests data={requests} limit={3} />
        </div>
    );
}