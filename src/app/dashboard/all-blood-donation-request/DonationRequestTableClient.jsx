"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiActivity } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function DonationRequestTableClient({ initialRequests, currentUserRole }) {
    const [requests, setRequests] = useState(initialRequests);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const dropdownRef = useRef(null);

    // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার ইভেন্ট
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // ৩-ডট থেকে স্ট্যাটাস পরিবর্তনের রিয়েল-টাইম ফাংশন (PATCH)
    const handleStatusUpdate = async (requestId, newStatus) => {
        setActiveDropdown(null);
        try {
            const res = await fetch(`${baseUrl}/api/donation-request/status/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success(`Status updated to ${newStatus}`);
                // ফ্রন্টএন্ড স্টেট আপডেট
                setRequests(prev => prev.map(req => req._id === requestId ? { ...req, status: newStatus } : req));
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // রিকোয়েস্ট ডিলিট করার ফাংশন (শুধুমাত্র Admin)
    const handleDeleteRequest = async (requestId) => {
        setActiveDropdown(null);
        if (!confirm("Are you sure you want to delete this donation request?")) return;

        try {
            const res = await fetch(`${baseUrl}/api/donation-request/${requestId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                toast.success("Request deleted successfully");
                setRequests(prev => prev.filter(req => req._id !== requestId));
            } else {
                throw new Error("Failed to delete request");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ফিল্টারিং লজিক
    const filteredRequests = filterStatus === "all" 
        ? requests 
        : requests.filter(req => req.status?.toLowerCase() === filterStatus.toLowerCase());

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-amber-950/40 text-amber-400 border border-amber-900/50";
            case "inprogress": return "bg-blue-950/40 text-blue-400 border border-blue-900/50";
            case "done": return "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50";
            case "canceled": return "bg-rose-950/40 text-rose-400 border border-rose-900/50";
            default: return "bg-gray-800 text-gray-400";
        }
    };

    return (
        <>
            <Toaster position="top-right" toastOptions={{ style: { background: '#12131A', color: '#FFF' } }} />
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                
                {/* 🏷️ প্রিমিয়াম হেডার এবং ফিল্টার ট্যাব */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#11121A] p-6 rounded-2xl border border-gray-800/60">
                    <div>
                        <h2 className="text-xl font-black tracking-wide text-gray-100">All Blood Donation Requests</h2>
                        <p className="text-xs text-gray-500 mt-1">Role-based Access Control Dashboard ({currentUserRole})</p>
                    </div>
                    
                    {/* কাস্টম ফিল্টার ট্যাব */}
                    <div className="flex flex-wrap gap-2 bg-[#171822] p-1.5 rounded-xl border border-gray-800">
                        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    filterStatus === status 
                                        ? "bg-[#800020] text-white shadow-lg" 
                                        : "text-gray-400 hover:text-gray-200"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 📊 কাস্টম ডার্ক মেটেরিয়াল টেবিল */}
                <div className="bg-[#11121A] rounded-2xl border border-gray-800/60 overflow-visible shadow-2xl">
                    
                    {/* টেবিল হেডার */}
                    <div className="grid grid-cols-12 bg-[#151622] py-4 px-6 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-800/80">
                        <div className="col-span-3">Recipient</div>
                        <div className="col-span-3">Location & Hospital</div>
                        <div className="col-span-2 text-center">Date & Time</div>
                        <div className="col-span-1 text-center">Group</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* টেবিল বডি */}
                    <div className="flex flex-col divide-y divide-gray-800/40 overflow-visible">
                        {filteredRequests.map((request) => {
                            const nameInitials = request.recipientName
                                ? request.recipientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                : 'RE';

                            return (
                                <div key={request._id} className="grid grid-cols-12 items-center py-5 px-6 hover:bg-[#151722]/40 transition-colors overflow-visible">
                                    
                                    {/* ১. রিকিপিয়েন্ট অ্যাভাটার ও নাম */}
                                    <div className="col-span-3 flex items-center gap-3 pr-2">
                                        <div className="w-9 h-9 bg-gray-800 text-gray-400 border border-gray-700 font-bold rounded-full flex items-center justify-center text-xs shrink-0">
                                            {nameInitials}
                                        </div>
                                        <div className="truncate">
                                            <h4 className="text-sm font-bold text-gray-200">{request.recipientName}</h4>
                                            <p className="text-[11px] text-gray-500 truncate mt-0.5">{request.requestMessage || "Emergency case"}</p>
                                        </div>
                                    </div>

                                    {/* ২. লোকেশন ও হাসপাতাল */}
                                    <div className="col-span-3 pr-2">
                                        <h4 className="text-xs font-bold text-gray-300 truncate">{request.hospitalName || "N/A"}</h4>
                                        <p className="text-[11px] text-gray-500 mt-0.5 capitalize">{request.upazila || request.recipientUpazila}, {request.district || request.recipientDistrict}</p>
                                    </div>

                                    {/* ৩. ডেট ও টাইম */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-xs font-medium text-gray-300 block">{request.donationDate}</span>
                                        <span className="text-[10px] text-gray-500 block mt-0.5">{request.donationTime}</span>
                                    </div>

                                    {/* ৪. ব্লাড গ্রুপ */}
                                    <div className="col-span-1 text-center">
                                        <span className="inline-block px-2.5 py-0.5 rounded bg-red-950/20 text-red-500 border border-red-900/30 text-xs font-black">
                                            {request.bloodGroup}
                                        </span>
                                    </div>

                                    {/* ৫. ডোনেশন স্ট্যাটাস */}
                                    <div className="col-span-2 text-center">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(request.status || "pending")}`}>
                                            {request.status || "pending"}
                                        </span>
                                    </div>

                                    {/* ৬. ৩-ডট পপআপ মেনু (১০০% ওয়ার্কিং) */}
                                    <div className="col-span-1 text-right relative overflow-visible" ref={activeDropdown === request._id ? dropdownRef : null}>
                                        <button 
                                            onClick={(e) => toggleDropdown(request._id, e)}
                                            className="p-1.5 text-gray-500 hover:text-gray-200 rounded-lg hover:bg-gray-800/40 transition-colors"
                                        >
                                            <FiMoreVertical className="size-4" />
                                        </button>

                                        {activeDropdown === request._id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-[#171822] border border-gray-800/80 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                                                
                                                <a href={`/dashboard/donation-request/${request._id}`} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 flex items-center gap-2 transition-colors">
                                                    <FiEye className="size-3.5" /> View Details
                                                </a>

                                                {/* ভলান্টিয়ার ও অ্যাডমিন উভয়েই স্ট্যাটাস কন্ট্রোল করতে পারবে */}
                                                {request.status?.toLowerCase() === "inprogress" && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(request._id, "done")} className="w-full text-left px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-950/20 flex items-center gap-2 transition-colors">
                                                            <FiCheckCircle className="size-3.5" /> Mark as Done
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(request._id, "canceled")} className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/20 flex items-center gap-2 transition-colors">
                                                            <FiXCircle className="size-3.5" /> Cancel Request
                                                        </button>
                                                    </>
                                                )}

                                                {request.status?.toLowerCase() === "pending" && (
                                                    <button onClick={() => handleStatusUpdate(request._id, "inprogress")} className="w-full text-left px-4 py-2 text-xs text-blue-400 hover:bg-blue-950/20 flex items-center gap-2 transition-colors">
                                                        <FiActivity className="size-3.5" /> Start Progress
                                                    </button>
                                                )}

                                                {/* এক্সক্লুসিভ অ্যাডমিন অ্যাকশনস (মডিউল রেস্ট্রিকশন অনুযায়ী) */}
                                                {currentUserRole === "Admin" && (
                                                    <div className="border-t border-gray-800/60 mt-1 pt-1">
                                                        <a href={`/dashboard/edit-donation-request/${request._id}`} className="w-full text-left px-4 py-2 text-xs text-amber-400 hover:bg-amber-950/10 flex items-center gap-2 transition-colors">
                                                            <FiEdit2 className="size-3.5" /> Edit Request
                                                        </a>
                                                        <button onClick={() => handleDeleteRequest(request._id)} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-950/20 flex items-center gap-2 transition-colors">
                                                            <FiTrash2 className="size-3.5" /> Delete Request
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                    {filteredRequests.length === 0 && (
                        <div className="text-center py-16 text-gray-500 text-xs tracking-wider">
                            NO DONATION REQUESTS FOUND.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}