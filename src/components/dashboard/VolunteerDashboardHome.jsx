"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import { useSession } from "@/lib/auth-client";

export default function VolunteerDashboardHome() {
    const { data: session } = useSession();

    const [donationRequests, setDonationRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/create-donation-request`);
                const data = await res.json();
                setDonationRequests(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Volunteer dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [baseUrl]);

    // ✅ real donation request ডাটা থেকে stats বের করা হচ্ছে
    const stats = useMemo(() => {
        const total = donationRequests.length;
        const active = donationRequests.filter((r) => r.status === "Active").length;
        const fulfilled = total - active;

        return { total, active, fulfilled };
    }, [donationRequests]);

    if (loading) return <div className="p-8">Loading...</div>;

    // ✅ session থেকে real নাম
    const volunteerName = session?.user?.name || "Volunteer";

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome, {volunteerName}!</h1>
                <p className="text-gray-600">You can manage donation requests here.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <StatCard title="Total Donation Requests" count={stats.total} />
                <StatCard title="Active Requests" count={stats.active} />
                <StatCard title="Fulfilled Requests" count={stats.fulfilled} />
            </div>
        </div>
    );
}