"use client";

import React, { useState, useEffect } from "react";
import { Button, Spinner, Modal } from "@heroui/react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function MyDonationRequestsClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const itemsPerPage = 5;
    const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1"));

    // ✅ Fetch requests
    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            console.log("📍 Calling:", "/api/internal/my-donation-requests");

            const response = await fetch("/api/internal/my-donation-requests");

            console.log("📡 Response status:", response.status);
            console.log("📡 Response ok:", response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log("❌ Error response:", errorText);
                throw new Error(`Failed: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Data:", data);
            setRequests(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error("❌ Full error:", error.message);
            toast.error("Failed to load requests");
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // ✅ Filter requests
    const filteredRequests = statusFilter === "All"
        ? requests
        : requests.filter(r => r.status === statusFilter);

    // ✅ Pagination calculations
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const validPage = Math.min(currentPage, Math.max(1, totalPages));
    
    const startIndex = (validPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    // ✅ Change page (update URL)
    const handlePageChange = (page) => {
        const newPage = Math.max(1, Math.min(page, totalPages || 1));
        router.push(`?page=${newPage}`);
    };

    // ✅ Change filter (reset to page 1)
    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
        router.push("?page=1");
    };

    // ✅ Delete request
    const handleDelete = async () => {
        if (!selectedRequest) return;

        try {
            setActionLoading(selectedRequest._id);
            const response = await fetch(
                `/api/internal/donation-delete/${selectedRequest._id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || "Failed to delete");
            }

            setRequests(requests.filter(r => r._id !== selectedRequest._id));
            toast.success("Request deleted successfully");
            setIsDeleteModalOpen(false);
            
            // Reset pagination if needed
            if (paginatedRequests.length === 1 && validPage > 1) {
                handlePageChange(validPage - 1);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to delete request");
        } finally {
            setActionLoading(null);
        }
    };

    // ✅ Status update
    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            setActionLoading(requestId);
            const response = await fetch(`/api/internal/donation-status/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || "Failed to update status");
            }

            setRequests(prev =>
                prev.map(r => (r._id === requestId ? { ...r, status: newStatus } : r))
            );
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Spinner size="lg" color="current" />
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">My Donation Requests</h1>
                            <p className="text-gray-600 mt-2">Manage all your donation requests</p>
                        </div>
                        <Link href="/dashboard/donor/create-donation-request">
                            <Button className="bg-[#800020] text-white font-semibold">
                                + New Request
                            </Button>
                        </Link>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-3 mb-6 flex-wrap">
                        {["All", "Pending", "In Progress", "Done", "Canceled"].map((filter) => (
                            <Button
                                key={filter}
                                onPress={() => handleFilterChange(filter)}
                                className={`${statusFilter === filter
                                    ? "bg-[#800020] text-white"
                                    : "bg-white text-gray-700 border border-gray-200"
                                    } font-semibold rounded-lg`}
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>

                    {/* Results Info */}
                    {filteredRequests.length > 0 && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
                        </div>
                    )}

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Recipient</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Blood Group</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            {filteredRequests.length === 0 && requests.length === 0
                                                ? "No requests found. Create your first donation request!"
                                                : "No requests matching this filter"}
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedRequests.map((request) => (
                                        <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {request.recipientName}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                                                    {request.bloodGroup}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {request.district}, {request.upazila}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {request.donationDate}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${request.status === "Pending"
                                                        ? "bg-yellow-50 text-yellow-700"
                                                        : request.status === "In Progress"
                                                            ? "bg-blue-50 text-blue-700"
                                                            : request.status === "Done"
                                                                ? "bg-green-50 text-green-700"
                                                                : "bg-red-50 text-red-700"
                                                        }`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 items-center flex-wrap">
                                                    <Link href={`/blood-donation/${request._id}`}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                        >
                                                            <FiEye />
                                                        </Button>
                                                    </Link>

                                                    <Link href={`/dashboard/edit-donation-request/${request._id}`}>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            className="bg-green-50 text-green-600 hover:bg-green-100"
                                                        >
                                                            <FiEdit2 />
                                                        </Button>
                                                    </Link>

                                                    {/* Done/Cancel buttons - only for In Progress */}
                                                    {request.status === "In Progress" && (
                                                        <>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                                onPress={() => handleStatusUpdate(request._id, "Done")}
                                                                isDisabled={actionLoading === request._id}
                                                                title="Mark as Done"
                                                            >
                                                                <FiCheckCircle />
                                                            </Button>
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                className="bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                                onPress={() => handleStatusUpdate(request._id, "Canceled")}
                                                                isDisabled={actionLoading === request._id}
                                                                title="Cancel Request"
                                                            >
                                                                <FiXCircle />
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        className="bg-red-50 text-red-600 hover:bg-red-100"
                                                        onPress={() => {
                                                            setSelectedRequest(request);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        isDisabled={actionLoading === request._id}
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <Button
                                onPress={() => handlePageChange(validPage - 1)}
                                isDisabled={validPage === 1}
                                isIconOnly
                                className="bg-white text-gray-700 border border-gray-200"
                            >
                                <FiChevronLeft />
                            </Button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first, last, current, and neighbors
                                    const showPage = pageNum === 1 || 
                                                   pageNum === totalPages || 
                                                   Math.abs(pageNum - validPage) <= 1;
                                    
                                    if (!showPage && i > 0 && i < totalPages - 1) {
                                        if (i === 1 && validPage > 3) return <span key={`dots-${i}`} className="px-2">...</span>;
                                        if (i === totalPages - 2 && validPage < totalPages - 2) return <span key={`dots-${i}`} className="px-2">...</span>;
                                        return null;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            onPress={() => handlePageChange(pageNum)}
                                            className={
                                                validPage === pageNum
                                                    ? "bg-[#800020] text-white"
                                                    : "bg-white text-gray-700 border border-gray-200"
                                            }
                                            size="sm"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                onPress={() => handlePageChange(validPage + 1)}
                                isDisabled={validPage === totalPages}
                                isIconOnly
                                className="bg-white text-gray-700 border border-gray-200"
                            >
                                <FiChevronRight />
                            </Button>

                            <span className="ml-4 text-sm text-gray-600">
                                Page {validPage} of {totalPages}
                            </span>
                        </div>
                    )}

                    {/* Delete Modal */}
                    <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                        <Modal.Body className="py-6 px-6">
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold">Delete Request?</h2>
                                <p className="text-gray-600">
                                    Are you sure you want to delete "{selectedRequest?.recipientName}"? This action cannot be undone.
                                </p>
                                <div className="flex gap-3 justify-end pt-4">
                                    <Button
                                        className="bg-white text-gray-700 border border-gray-200"
                                        onPress={() => setIsDeleteModalOpen(false)}
                                        isDisabled={actionLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-red-600 text-white"
                                        onPress={() => handleDelete()}
                                        isDisabled={actionLoading}
                                    >
                                        {actionLoading ? "Deleting..." : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>
    );
}