"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import RecentDonationRequests from './RecentDonationRequests';
import { useSession } from "@/lib/auth-client";

export default function VolunteerDashboardHome() {
    const { data: session } = useSession();

    const [donationRequests, setDonationRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // ✅ Express কে সরাসরি না কল করে নিজের Next.js internal route কল করছি
                const res = await fetch("/api/internal/dashboard-data?type=volunteer");

                if (!res.ok) {
                    throw new Error("Failed to fetch volunteer dashboard data");
                }

                const { requests } = await res.json();
                setDonationRequests(Array.isArray(requests) ? requests : []);
            } catch (error) {
                console.error("Volunteer dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const stats = useMemo(() => {
        const total = donationRequests.length;
        const pending = donationRequests.filter((r) => r.status === "Pending").length;
        const inProgress = donationRequests.filter((r) => r.status === "In Progress").length;

        return { total, pending, inProgress };
    }, [donationRequests]);

    if (loading) return <div className="p-8">Loading...</div>;

    const volunteerName = session?.user?.name || "Volunteer";

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome, {volunteerName}!</h1>
                <p className="text-gray-600">You can manage donation requests here.</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
                <StatCard title="Total Donation Requests" count={stats.total} />
                <StatCard title="Pending Requests" count={stats.pending} />
                <StatCard title="In Progress Requests" count={stats.inProgress} />
            </div>

            <RecentDonationRequests data={donationRequests} limit={3} />
        </div>
    );
}