"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Chip } from "@heroui/react";
import { FiMoreVertical, FiUserCheck, FiShield, FiSlash, FiCheck } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function AllUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    // কোন ইউজারের ড্রপডাউন খোলা আছে তা ট্র্যাক করার স্টেট
    const [activeDropdown, setActiveDropdown] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const dropdownRef = useRef(null);

    // ১. ব্যাকএন্ড থেকে সব রিয়েল ইউজার ডাটা ফেচ করা
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/all-users`);
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users from backend");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার লজিক
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ২. থ্রি-ডট ক্লিক হ্যান্ডেলার
    const toggleDropdown = (id, e) => {
        e.stopPropagation(); // ইভেন্ট বাবলিং বন্ধ করা
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // ৩. রিয়েল-টাইম ব্যাকএন্ড অ্যাকশন (PATCH Request)
    const handleAction = async (userId, actionType) => {
        setActiveDropdown(null); // অ্যাকশন নেওয়ার সাথে সাথে ড্রপডাউন বন্ধ হবে
        try {
            let url = "";
            let bodyData = {};

            if (actionType === "block") {
                url = `${baseUrl}/api/all-users/status/${userId}`;
                bodyData = { status: "Blocked" };
            } else if (actionType === "unblock") {
                url = `${baseUrl}/api/all-users/status/${userId}`;
                bodyData = { status: "Active" };
            } else if (actionType === "make_volunteer") {
                url = `${baseUrl}/api/all-users/role/${userId}`;
                bodyData = { role: "Volunteer" };
            } else if (actionType === "make_admin") {
                url = `${baseUrl}/api/all-users/role/${userId}`;
                bodyData = { role: "Admin" };
            }

            const res = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {
                toast.success("User updated successfully!");
                fetchUsers(); // ডাটা রি-লোডিং
            } else {
                throw new Error("Failed to update");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center">
                <div className="text-[#800020] font-bold text-lg animate-pulse">Loading users from database...</div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            {/* মেইন ব্যাকগ্রাউন্ড */}
            <div className="min-h-screen bg-[#FCE8E9] p-4 sm:p-10 flex flex-col items-center">

                {/* টেবিল কন্টেইনার: সাদা ব্যাকগ্রাউন্ড এবং হালকা শ্যাডো */}
                <div className="max-w-6xl w-full bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* টেবিল হেডার: এখন হালকা গ্রে ব্যাকগ্রাউন্ড */}
                    <div className="grid grid-cols-12 bg-gray-50 py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                        <div className="col-span-6 sm:col-span-5">User</div>
                        <div className="col-span-3 text-center sm:text-left">Role</div>
                        <div className="col-span-2 text-center sm:text-left">Status</div>
                        <div className="col-span-1 sm:col-span-2 text-right">Actions</div>
                    </div>

                    {/* টেবিল বডি */}
                    <div className="flex flex-col divide-y divide-gray-100">
                        {users.map((singleUser) => (
                            <div key={singleUser._id} className="grid grid-cols-12 items-center py-5 px-6 hover:bg-gray-50/80 transition-colors">

                                {/* ১. ইউজার ইনফো */}
                                <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                                    <Image
                                        src={singleUser.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100&q=80"}
                                        alt={singleUser.name}
                                        width={44}
                                        height={44}
                                        className="rounded-full object-cover border border-gray-100"
                                    />
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{singleUser.name}</h4>
                                        <p className="text-xs text-gray-500">{singleUser.email}</p>
                                    </div>
                                </div>

                                {/* ২. রোল (সফট কালার চিপ) */}
                                <div className="col-span-3 text-center sm:text-left">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${singleUser.role === "Admin" ? "bg-red-50 text-red-600" :
                                        singleUser.role === "Volunteer" ? "bg-purple-50 text-purple-600" :
                                            "bg-gray-100 text-gray-600"
                                        }`}>
                                        {singleUser.role || "Donor"}
                                    </span>
                                </div>

                                {/* ৩. স্ট্যাটাস */}
                                <div className="col-span-2 text-center sm:text-left">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${singleUser.status === "Blocked" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                        {singleUser.status || "Active"}
                                    </span>
                                </div>

                                {/* ৪. অ্যাকশন ড্রপডাউন */}
                                <div className="col-span-1 sm:col-span-2 text-right relative" ref={activeDropdown === singleUser._id ? dropdownRef : null}>
                                    <button
                                        onClick={(e) => toggleDropdown(singleUser._id, e)}
                                        className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <FiMoreVertical className="size-5" />
                                    </button>

                                    {/* ড্রপডাউন মেনু: এখন লাইট থিম */}
                                    {activeDropdown === singleUser._id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5">
                                            {/* মেনু আইটেমগুলোও এখন ডার্ক টেক্সট */}
                                            <button onClick={() => handleAction(singleUser._id, singleUser.status === "Blocked" ? "unblock" : "block")}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                                {singleUser.status !== "Blocked" ? <FiSlash /> : <FiCheck />} {singleUser.status !== "Blocked" ? "Block" : "Unblock"}
                                            </button>
                                            <button onClick={() => handleAction(singleUser._id, "make_volunteer")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                                <FiUserCheck /> Make Volunteer
                                            </button>
                                            <button onClick={() => handleAction(singleUser._id, "make_admin")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                                                <FiShield /> Make Admin
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );



}