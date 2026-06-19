"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import DonationTable from './DonationTable';
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

    // ✅ real `requests` ডাটা থেকে stats বের করা হচ্ছে (আর hardcoded না)
    const stats = useMemo(() => {
        const pendingCount = requests.filter((r) => r.status === "Active").length;

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
                  এটা ভিন্ন ধরনের ডাটা — donor হিসেবে তুমি আসলে কতজনকে রক্ত দিয়েছো
                  (donation history), যেটা এখনকার "create-donation-request" কালেকশনে
                  ট্র্যাক হয় না (ওটা request collection, donation history না)।
                  পরে backend এ এই field/collection যোগ করলে এখানে বসিয়ে দিও।
                */}
                <StatCard title="Lives Saved" count="—" />
            </div>

            {/* Recent Donation Requests টেবিল — এটা আগে থেকেই real data ব্যবহার করছিল */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Recent Donation Requests</h2>
                <DonationTable data={requests} />
            </div>
        </div>
    );
}