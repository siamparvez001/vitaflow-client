"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import AdminDashboardStatsCard from "./AdminDashboardStatsCard";

// Icons
import { FiUsers, FiDollarSign, FiClipboard } from "react-icons/fi";

export default function AdminDashboardStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFunding: 0,
        totalRequests: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/internal/stats");

                if (!response.ok) {
                    throw new Error(`Failed to fetch stats: ${response.status}`);
                }

                const data = await response.json();
                console.log("📊 Stats fetched:", data);

                setStats({
                    totalUsers: data.totalUsers || 0,
                    totalFunding: data.totalFunding || 0,
                    totalRequests: data.totalRequests || 0,
                });
            } catch (error) {
                console.error("❌ Error fetching stats:", error.message);
                toast.error("Failed to load statistics");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" color="current" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Users Card */}
            <AdminDashboardStatsCard
                icon={FiUsers}
                title="Total Donors"
                value={stats.totalUsers}
                color="bg-blue-500"
            />

            {/* Total Funding Card */}
            <AdminDashboardStatsCard
                icon={FiDollarSign}
                title="Total Funding"
                value={`$${stats.totalFunding.toLocaleString()}`}
                color="bg-green-500"
            />

            {/* Total Requests Card */}
            <AdminDashboardStatsCard
                icon={FiClipboard}
                title="Total Requests"
                value={stats.totalRequests}
                color="bg-[#800020]"
            />
        </div>
    );
}