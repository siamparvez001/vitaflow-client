"use client";

import React from "react";

export default function AdminDashboardStatsCard({ icon: Icon, title, value, color }) {
    return (
        <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow`}>
            {/* Header with icon and title */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {title}
                </h3>
                <div className={`${color} p-3 rounded-lg`}>
                    <Icon className="text-white text-xl" />
                </div>
            </div>

            {/* Value - Big number */}
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                <span className="text-xs text-gray-500 mt-2">
                    Updated just now
                </span>
            </div>
        </div>
    );
}