// app/donation-requests
import React from 'react';
import DonationTable from '@/components/dashboard/DonationTable';

// সার্ভার সাইড ডাটা ফেচিং
async function getAllDonationRequests() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/api/all-blood-donation-request`, {
        cache: 'no-store' // রিয়েল-টাইম ডাটার জন্য
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function DonationRequestsPage() {
    const allRequest = await getAllDonationRequests();

    return (
        <div className="min-h-screen bg-[#FCE8E9] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-rose-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">
                    All Blood Donation Requests
                </h2>
                
                {/* আপনার বানানো টেবিল কম্পোনেন্টটি এখানে পাস করুন */}
                <DonationTable data={allRequest} />
            </div>
        </div>
    );
}