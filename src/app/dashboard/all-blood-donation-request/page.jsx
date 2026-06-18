import { getAllDonationRequest } from '@/lib/api/blood_request';
import { auth } from "@/lib/auth";
import { headers } from "next/headers"; 
import React from 'react';
import { FiEye, FiEdit2, FiTrash2, FiSliders } from "react-icons/fi";

const AllDonationRequestPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userId = session?.user?.id;

    // ⚡ এখানে কোন স্ট্যাটাস পাস করা হয়নি, তাই আপনার এপিআই ডাইনামিকালি 'active' স্ট্যাটাসের ডাটা নিয়ে আসবে
    const allRequest = userId ? await getAllDonationRequest(userId) : [];

    console.log("All Active Blood Requests for this user:", allRequest);

    // স্ট্যাটাস অনুযায়ী ডাইনামিক ব্যাজ কালার সেট করার ফাংশন
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-[#E8F5E9] text-[#2E7D32] font-bold border border-green-100';
            case 'pending':
                return 'bg-[#FDF0F0] text-[#D32F2F] font-bold border border-red-100';
            case 'in progress':
                return 'bg-[#E0F7FA] text-[#00838F] font-bold';
            case 'done':
                return 'bg-[#E8F5E9] text-[#2E7D32] font-bold';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F6] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                
                {/* 🏷️ হেডার এবং ফিল্টার বাটন সেকশন */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Donation Requests</h2>
                    <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiSliders className="size-4" /> Filter
                    </button>
                </div>

                {/* 📊 মেইন টেবিল কন্টেইনার */}
                {allRequest.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-medium">
                        No active blood requests found.
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#FFF5F5] text-gray-600 text-sm font-semibold border-b border-gray-100">
                                    <th className="py-4 px-6 rounded-l-xl">Recipient Name</th>
                                    <th className="py-4 px-6">Location</th>
                                    <th className="py-4 px-6">Date & Time</th>
                                    <th className="py-4 px-6">Blood Group</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 rounded-r-xl text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allRequest.map((request) => {
                                    // নামের প্রথম অক্ষর দিয়ে গোল ব্যাজ বা অ্যাভাটার বানানোর জন্য
                                    const nameInitials = request.recipientName
                                        ? request.recipientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                        : 'RE';

                                    return (
                                        <tr key={request._id} className="hover:bg-gray-50/50 transition-colors text-sm text-gray-800">
                                            
                                            {/* ১. রিকিপিয়েন্ট নাম (অ্যাভাটার সহ) */}
                                            <td className="py-4 px-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 text-gray-600 font-bold rounded-full flex items-center justify-center text-xs shrink-0 tracking-wider">
                                                        {nameInitials}
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-base">{request.recipientName}</span>
                                                </div>
                                            </td>

                                            {/* ২. লোকেশন (ডিস্ট্রিক্ট ও উপজেলা) */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 capitalize">{request.district}</span>
                                                    <span className="text-gray-500 text-xs capitalize">{request.upazila}, Upazila</span>
                                                </div>
                                            </td>

                                            {/* ৩. ডেট এবং টাইম */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col text-gray-700">
                                                    <span className="font-medium">{request.donationDate}</span>
                                                    <span className="text-gray-500 text-xs">{request.donationTime}</span>
                                                </div>
                                            </td>

                                            {/* ৪. ব্লাড গ্রুপ ব্যাজ */}
                                            <td className="py-4 px-6">
                                                <span className="inline-block bg-[#FDF0F0] text-[#D32F2F] font-bold text-xs px-2.5 py-1 rounded-md border border-red-500/10 shadow-sm">
                                                    {request.bloodGroup}
                                                </span>
                                            </td>

                                            {/* ৫. স্ট্যাটাস ব্যাজ */}
                                            <td className="py-4 px-6">
                                                <span className={`inline-block text-[11px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status || 'ACTIVE'}
                                                </span>
                                            </td>

                                            {/* ৬. অ্যাকশন বাটন আইকনস */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-4 text-gray-500">
                                                    <button className="hover:text-blue-600 p-1 rounded transition-colors" title="View Details">
                                                        <FiEye className="size-4.5" />
                                                    </button>
                                                    <button className="hover:text-amber-600 p-1 rounded transition-colors" title="Edit Request">
                                                        <FiEdit2 className="size-4.5" />
                                                    </button>
                                                    <button className="hover:text-red-600 p-1 rounded transition-colors" title="Delete Request">
                                                        <FiTrash2 className="size-4.5" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllDonationRequestPage;