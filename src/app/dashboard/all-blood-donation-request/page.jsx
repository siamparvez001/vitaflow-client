import { getAllDonationRequest } from '@/lib/api/blood_request'; // আপনার কাস্টম API ফেচার
import { auth } from "@/lib/auth";
import { headers } from "next/headers"; 
import React from 'react';
import DonationRequestTableClient from './DonationRequestTableClient'; // ক্লায়েন্ট কম্পোনেন্টটি ইমপোর্ট করছি

const AllDonationRequestPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userId = session?.user?.id;
    const currentUserRole = session?.user?.role || "Volunteer"; // 'Admin' অথবা 'Volunteer'

    // ব্যাকএন্ড থেকে সবার রিকোয়েস্ট ডাটা তুলে আনা
    const allRequest = userId ? await getAllDonationRequest(userId) : [];

    return (
        <div className="min-h-screen bg-[#FCE8E9] p-4 sm:p-10 text-gray-100 font-sans">
            {/* আমরা রিয়েল ডাটা এবং রোল ক্লায়েন্ট টেবিলকে পাস করে দিচ্ছি */}
            <DonationRequestTableClient 
                initialRequests={allRequest} 
                currentUserRole={currentUserRole} 
            />
        </div>
    );
};

export default AllDonationRequestPage;