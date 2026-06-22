import React from "react";
import AdminDashboardStats from "@/components/dashboard/AdminDashboardStats";
import { requireRole } from "@/lib/actions/roleCheck";

export const metadata = {
    title: "Admin Dashboard - VitaFlow",
    description: "Admin dashboard with statistics and user management",
};

export default async function AdminDashboardPage() {
    // Verify admin access
    await requireRole(["Admin"]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome back, Admin! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's your blood donation platform overview
                    </p>
                </div>

                {/* Stats Cards Section */}
                <AdminDashboardStats />

                {/* Future sections will go here */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Recent Activity
                    </h2>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
                        <p className="text-gray-500">
                            More features coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}