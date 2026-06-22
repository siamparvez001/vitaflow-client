"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@heroui/react";
import { FiMoreVertical, FiUserCheck, FiShield, FiSlash, FiCheck, FiUser } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function AllUsersPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const statusFilter = searchParams.get("status") || "All";

    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const itemsPerPage = 8;
    const dropdownRef = useRef(null);

    const updateUrl = (params) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        router.push(`/dashboard/all-users?${newParams.toString()}`);
    };

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const query = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
            });
            if (statusFilter !== "All") {
                query.set("status", statusFilter);
            }

            const res = await fetch(`/api/internal/all-users?${query.toString()}`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            setUsers(result.data || []);
            setTotalPages(result.totalPages || 1);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
            setUsers([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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

    const handleAction = async (userId, actionType) => {
        setActiveDropdown(null);
        try {
            let url = "";
            let bodyData = {};

            if (actionType === "block") {
                url = `/api/internal/user-status/${userId}`;
                bodyData = { status: "Blocked" };
            } else if (actionType === "unblock") {
                url = `/api/internal/user-status/${userId}`;
                bodyData = { status: "Active" };
            } else if (actionType === "make_volunteer") {
                url = `/api/internal/user-role/${userId}`;
                bodyData = { role: "Volunteer" };
            } else if (actionType === "make_admin") {
                url = `/api/internal/user-role/${userId}`;
                bodyData = { role: "Admin" };
            }

            const res = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });

            if (res.ok) {
                toast.success("User updated successfully!");
                fetchUsers();
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update");
            }
        } catch (error) {
            console.error("Action error:", error);
            toast.error(error.message || "Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FCE8E9] flex items-center justify-center">
                <div className="text-[#800020] font-bold text-lg animate-pulse">
                    Loading users from database...
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-[#FCE8E9] p-4 sm:p-10 flex flex-col items-center">

                <div className="max-w-6xl w-full flex gap-3 mb-6 flex-wrap">
                    {["All", "Active", "Blocked"].map((filter) => (
                        <Button
                            key={filter}
                            onPress={() => updateUrl({ status: filter === "All" ? null : filter, page: 1 })}
                            className={`${statusFilter === filter
                                ? "bg-[#800020] text-white"
                                : "bg-white text-gray-700 border border-gray-200"
                                } font-semibold rounded-lg`}
                        >
                            {filter}
                        </Button>
                    ))}
                </div>

                <div className="max-w-6xl w-full bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

                    <div className="grid grid-cols-12 bg-gray-50 py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                        <div className="col-span-6 sm:col-span-5">User</div>
                        <div className="col-span-3 text-center sm:text-left">Role</div>
                        <div className="col-span-2 text-center sm:text-left">Status</div>
                        <div className="col-span-1 sm:col-span-2 text-right">Actions</div>
                    </div>

                    <div className="flex flex-col divide-y divide-gray-100">
                        {users && users.length > 0 ? (
                            users.map((singleUser) => (
                                <div
                                    key={singleUser._id}
                                    className="grid grid-cols-12 items-center py-5 px-6 hover:bg-gray-50/80 transition-colors"
                                >
                                    <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                                        {singleUser.image ? (
                                            <Image
                                                src={singleUser.image}
                                                alt={singleUser.name}
                                                width={44}
                                                height={44}
                                                className="rounded-full object-cover border border-gray-100"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                                                <FiUser className="text-gray-500" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{singleUser.name || "N/A"}</h4>
                                            <p className="text-xs text-gray-500">{singleUser.email || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-3 text-center sm:text-left">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${singleUser.role === "Admin" ? "bg-red-50 text-red-600" :
                                                singleUser.role === "Volunteer" ? "bg-purple-50 text-purple-600" :
                                                    "bg-gray-100 text-gray-600"
                                            }`}>
                                            {singleUser.role || "Donor"}
                                        </span>
                                    </div>

                                    <div className="col-span-2 text-center sm:text-left">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${singleUser.status === "Blocked"
                                                ? "bg-rose-50 text-rose-600"
                                                : "bg-emerald-50 text-emerald-600"
                                            }`}>
                                            {singleUser.status || "Active"}
                                        </span>
                                    </div>

                                    <div
                                        className="col-span-1 sm:col-span-2 text-right relative"
                                        ref={activeDropdown === singleUser._id ? dropdownRef : null}
                                    >
                                        <button
                                            onClick={(e) => toggleDropdown(singleUser._id, e)}
                                            className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                            title="More actions"
                                        >
                                            <FiMoreVertical className="size-5" />
                                        </button>

                                        {activeDropdown === singleUser._id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1.5">
                                                <button
                                                    onClick={() => handleAction(
                                                        singleUser._id,
                                                        singleUser.status === "Blocked" ? "unblock" : "block"
                                                    )}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                                >
                                                    {singleUser.status !== "Blocked" ? (
                                                        <>
                                                            <FiSlash className="size-4" /> Block User
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiCheck className="size-4" /> Unblock User
                                                        </>
                                                    )}
                                                </button>

                                                {singleUser.role !== "Volunteer" && (
                                                    <button
                                                        onClick={() => handleAction(singleUser._id, "make_volunteer")}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                                    >
                                                        <FiUserCheck className="size-4" /> Make Volunteer
                                                    </button>
                                                )}

                                                {singleUser.role !== "Admin" && (
                                                    <button
                                                        onClick={() => handleAction(singleUser._id, "make_admin")}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                                                    >
                                                        <FiShield className="size-4" /> Make Admin
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-12 py-8 text-center text-gray-500">
                                No users found
                            </div>
                        )}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            onPress={() => updateUrl({ page: Math.max(1, currentPage - 1) })}
                            isDisabled={currentPage === 1}
                            className="bg-white text-gray-700 border border-gray-200"
                        >
                            Previous
                        </Button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                                key={i + 1}
                                onPress={() => updateUrl({ page: i + 1 })}
                                className={
                                    currentPage === i + 1
                                        ? "bg-[#800020] text-white"
                                        : "bg-white text-gray-700 border border-gray-200"
                                }
                            >
                                {i + 1}
                            </Button>
                        ))}

                        <Button
                            onPress={() => updateUrl({ page: Math.min(totalPages, currentPage + 1) })}
                            isDisabled={currentPage === totalPages}
                            className="bg-white text-gray-700 border border-gray-200"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}