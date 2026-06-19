"use client";
import React, { useState, useEffect } from "react";
import { use } from "react"; // ← এটা add করো
import Link from "next/link";
import { Card, Button } from "@heroui/react";
import { FiMapPin, FiClock, FiDroplet, FiPhone, FiMail, FiArrowLeft } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function DonationRequestDetailClient({ params, id }) {
    const resolvedId = id || use(params).id;

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    const fetchRequest = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${baseUrl}/api/create-donation-request`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const foundRequest = data.find(req => req._id === resolvedId);

            if (!foundRequest) {
                toast.error("Request not found");
                return;
            }

            setRequest(foundRequest);
        } catch (error) {
            console.error("Error fetching request:", error);
            toast.error("Failed to load request details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, [resolvedId]);
    // Donate Now হ্যান্ডলার
    const handleDonateNow = async () => {
        try {
            setDonating(true);
            // এখানে ভলান্টিয়ার ইনফরমেশন সংরক্ষণ করা যায়
            // আপাতত শুধু টোস্ট দেখাচ্ছি

            toast.success(
                "Thank you for volunteering! The requester will contact you soon.",
                {
                    duration: 4000,
                }
            );

            // বাস্তব অ্যাপে এখানে API call করা হবে
            // const res = await fetch(`${baseUrl}/api/donate/${request._id}`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ volunteerId: currentUserId })
            // });
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        } finally {
            setDonating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
                <div className="text-[#800020] font-bold text-lg animate-pulse">
                    Loading request details...
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex flex-col items-center justify-center">
                <p className="text-xl text-gray-600 mb-4">Request not found</p>
                <Link href="/blood-donation">
                    <Button className="bg-[#800020] text-white">
                        Back to Requests
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />

            {/* মেইন কন্টেইনার */}
            <div className="min-h-screen bg-[#FFF8F6] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* ব্যাক বাটন */}
                    <Link href="/blood-donation" className="inline-flex items-center gap-2 text-[#800020] hover:text-[#600018] font-semibold mb-8 transition-colors">
                        <FiArrowLeft className="w-5 h-5" />
                        Back to Requests
                    </Link>

                    {/* মেইন গ্রিড - 2 কলাম */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* বাম সাইড - ডিটেইলস (2/3) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* হেডার কার্ড */}
                            <Card className="overflow-hidden border border-gray-100 bg-white">
                                <div className="bg-gradient-to-r from-[#FDF0F0] to-[#FFE8E8] p-8 border-b border-red-100">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h1 className="text-4xl font-bold text-[#800020]">
                                                {request.bloodGroup}
                                            </h1>
                                            <p className="text-gray-600 mt-2">Blood Group Required</p>
                                        </div>
                                        <span className="px-4 py-2 bg-red-50 text-[#800020] font-bold rounded-full border border-red-200">
                                            🚨 Urgent
                                        </span>
                                    </div>

                                    {/* রিসিপিয়েন্ট ইনফো */}
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {request.recipientName}
                                    </h2>
                                    <p className="text-gray-700">
                                        Patient Record: <span className="font-semibold">{request._id?.slice(-6) || "N/A"}</span>
                                    </p>
                                </div>

                                {/* ডিটেইলস বডি */}
                                <div className="p-8 space-y-8">

                                    {/* রিকোয়েস্ট মেসেজ */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Request Message</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-gray-800 leading-relaxed">
                                                {request.requestMessage || "Blood donation needed for medical procedure"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* হাসপাটাল ইনফরমেশন */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Hospital Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-[#800020] flex-shrink-0">
                                                    <FiMapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">HOSPITAL NAME</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {request.hospitalName || "N/A"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-[#800020] flex-shrink-0">
                                                    <FiMapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">LOCATION</p>
                                                    <p className="text-gray-900 font-medium">
                                                        {request.upazila || "Area"}, {request.district || "District"}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {request.fullAddress || "Full address not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ডেট এবং টাইম */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Donation Timing</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">DATE NEEDED</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {request.donationDate || "N/A"}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">TIME NEEDED</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {request.donationTime || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* ডান সাইড - অ্যাকশন প্যানেল (1/3) */}
                        <div className="lg:col-span-1">
                            <Card className="overflow-hidden border border-gray-100 bg-white sticky top-8">

                                {/* ব্লাড গ্রুপ ডিসপ্লে */}
                                <div className="bg-gradient-to-br from-[#800020] to-[#600018] p-8 text-white text-center">
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2">Need</p>
                                    <h2 className="text-6xl font-black">
                                        {request.bloodGroup}
                                    </h2>
                                </div>

                                {/* রিকোয়েস্টার ইনফো */}
                                <div className="p-6 border-b border-gray-100">
                                    <p className="text-xs font-bold text-gray-700 uppercase mb-4">Requester</p>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Name</p>
                                            <p className="font-bold text-gray-900">
                                                {request.requesterName || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Email</p>
                                            <a href={`mailto:${request.requesterEmail}`} className="text-[#800020] font-semibold hover:underline text-sm break-all">
                                                {request.requesterEmail || "N/A"}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Donate Now বাটন */}
                                <div className="p-6">
                                    <Button
                                        onClick={handleDonateNow}
                                        disabled={donating}
                                        className="w-full bg-[#800020] text-white font-bold py-3 rounded-xl hover:bg-[#600018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                                    >
                                        {donating ? "Processing..." : "Donate Now"}
                                    </Button>
                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        The requester will contact you with further details
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}