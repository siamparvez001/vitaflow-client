"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button } from "@heroui/react";
import { FiMapPin, FiClock, FiDroplet, FiArrowRight } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function DonationRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);

            // ✅ আগে সরাসরি Express কে (`${baseUrl}/api/create-donation-request`)
            // ব্রাউজার থেকে কল করা হতো - কিন্তু ১) ওই route এখন Admin/Volunteer-only
            // protected, ২) এটা পাবলিক পেজ হওয়ায় internal secret ব্রাউজারে থাকাও
            // উচিত না। তাই এখন নিজের Next.js internal route কল করছি, যেটা ভিতরে
            // গিয়ে Express এর পাবলিক endpoint (শুধু Pending request) কল করে।
            const res = await fetch("/api/internal/public-donation-requests");

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load blood donation requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
                <div className="text-[#800020] font-bold text-lg animate-pulse">
                    Loading blood donation requests...
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#FFF8F6] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#800020] mb-3">
                            Blood Donation Requests
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Browse and respond to urgent blood donation requests in your area
                        </p>
                    </div>

                    {requests && requests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {requests.map((request) => (
                                <Card
                                    key={request._id}
                                    className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white"
                                >
                                    <div className="bg-gradient-to-r from-[#FDF0F0] to-[#FFE8E8] p-6 border-b border-red-100">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-[#800020]">
                                                    {request.bloodGroup}
                                                </h2>
                                                <p className="text-xs text-gray-600 mt-1">Blood Group</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-3 py-1 bg-red-50 text-[#800020] text-xs font-bold rounded-full border border-red-200">
                                                    Urgent
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900">
                                            {request.recipientName || "N/A"}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {request.requestMessage || "Blood donation needed"}
                                        </p>
                                    </div>

                                    <div className="p-6 space-y-4">

                                        <div className="flex items-start gap-3">
                                            <FiMapPin className="w-5 h-5 text-[#800020] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold">LOCATION</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {request.hospitalName || "Hospital"}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {request.upazila || "Area"}, {request.district || "District"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <FiClock className="w-5 h-5 text-[#800020] mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold">NEEDED</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {request.donationDate}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {request.donationTime}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <p className="text-xs text-gray-600 font-semibold mb-1">ADDRESS</p>
                                            <p className="text-xs text-gray-700 line-clamp-2">
                                                {request.fullAddress || "Address not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                                        <Link href={`/blood-donation/${request._id}`}>
                                            <Button
                                                className="w-full bg-[#800020] text-white font-semibold py-2.5 rounded-xl hover:bg-[#600018] transition-colors flex items-center justify-center gap-2"
                                            >
                                                View Details
                                                <FiArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-600">No donation requests found</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Check back later for urgent blood donation needs
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}