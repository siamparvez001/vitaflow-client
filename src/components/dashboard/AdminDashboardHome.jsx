"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { StatCard } from './StatCard';
import { useSession } from "@/lib/auth-client";
import RecentDonationRequests from './RecentDonationRequests';

export default function AdminDashboardHome() {
    const { data: session } = useSession();

    const [users, setUsers] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✅ আগে সরাসরি Express (baseUrl) কে কল করা হতো ব্রাউজার থেকে -
                // এখন নিজের Next.js এর internal route কে কল করছি, যেটা ভিতরে
                // গিয়ে secret সহ Express কে কল করে। internal secret ব্রাউজারে
                // exposed হয় না এভাবে।
                const res = await fetch("/api/internal/dashboard-data?type=admin");

                if (!res.ok) {
                    throw new Error("Failed to fetch admin dashboard data");
                }

                const { users: usersData, requests: requestsData } = await res.json();

                setUsers(Array.isArray(usersData) ? usersData : []);
                setDonationRequests(Array.isArray(requestsData) ? requestsData : []);
            } catch (error) {
                console.error("Admin dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalAdmins = users.filter((u) => u.role === "Admin").length;
        const totalVolunteers = users.filter((u) => u.role === "Volunteer").length;
        const pendingRequests = donationRequests.filter((r) => r.status === "Pending").length;

        return { totalUsers, totalAdmins, totalVolunteers, pendingRequests };
    }, [users, donationRequests]);

    if (loading) return <div className="p-8">Loading...</div>;

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

            <RecentDonationRequests data={donationRequests} limit={3} />
        </div>
    );
}