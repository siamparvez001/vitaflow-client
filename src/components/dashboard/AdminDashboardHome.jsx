"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
// import RecentDonationRequests from './RecentDonationRequests';
import { useSession } from "@/lib/auth-client";
import RecentDonationRequests from './RecentDonationRequests';

export default function AdminDashboardHome() {
    const { data: session } = useSession();

    const [users, setUsers] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, requestsRes] = await Promise.all([
                    fetch(`${baseUrl}/api/all-users`),
                    fetch(`${baseUrl}/api/create-donation-request`),
                ]);

                const usersData = await usersRes.json();
                const requestsData = await requestsRes.json();

                setUsers(Array.isArray(usersData) ? usersData : []);
                setDonationRequests(Array.isArray(requestsData) ? requestsData : []);
            } catch (error) {
                console.error("Admin dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    // ✅ real users + donation request ডাটা থেকে stats বের করা হচ্ছে
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalAdmins = users.filter((u) => u.role === "Admin").length;
        const totalVolunteers = users.filter((u) => u.role === "Volunteer").length;
        // ✅ FIX: status এখন backend এ default "Pending", আগে ভুলভাবে "Active" দিয়ে ফিল্টার হচ্ছিল
        const pendingRequests = donationRequests.filter((r) => r.status === "Pending").length;

        return { totalUsers, totalAdmins, totalVolunteers, pendingRequests };
    }, [users, donationRequests]);

    if (loading) return <div className="p-8">Loading...</div>;

    // ✅ session থেকে real নাম
    const adminName = session?.user?.name || "Admin";

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome, {adminName}!</h1>
                <p className="text-gray-600">You have full access to system management.</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Users" count={stats.totalUsers} />
                <StatCard title="Admins" count={stats.totalAdmins} />
                <StatCard title="Volunteers" count={stats.totalVolunteers} />
                <StatCard title="Pending Donation Requests" count={stats.pendingRequests} />
            </div>

            {/* ✅ প্রথম ৩টা donation request + See More বাটন */}
            <RecentDonationRequests data={donationRequests} limit={3} />
        </div>
    );
}