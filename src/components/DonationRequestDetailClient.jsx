"use client";
import React, { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, Modal } from "@heroui/react";
import { FiMapPin, FiArrowLeft } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function DonationRequestDetailClient({ params, id }) {
    // ✅ params থাকলে এবং সেটা Promise হলে use() দিয়ে resolve করো,
    // params undefined/null হলে use() কল করার দরকার নেই — সরাসরি id তে fallback করবে
    const resolvedParams =
        params && typeof params.then === "function" ? use(params) : params;

    const resolvedId = id || resolvedParams?.id;

    const router = useRouter();

    const { data: session, isPending: sessionPending } = useSession();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!sessionPending && !session) {
            router.push("/auth/signin");
        }
    }, [sessionPending, session, router]);

    const fetchRequest = async () => {
        // ✅ resolvedId না থাকলে fetch ই করবো না, নাহলে /api/.../undefined hit হবে
        if (!resolvedId) {
            setLoading(false);
            toast.error("Invalid request ID");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/internal/donation-request-detail/${resolvedId}`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setRequest(data);
        } catch (error) {
            console.error("Error fetching request:", error);
            toast.error("Failed to load request details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionPending || !session) return;
        fetchRequest();
    }, [resolvedId, sessionPending, session]);

    const handleConfirmDonation = async (close) => {
        if (!session?.user?.name || !session?.user?.email) {
            toast.error("তোমার account এর তথ্য পাওয়া যায়নি, আবার login করো");
            return;
        }

        try {
            setDonating(true);

            const res = await fetch(`/api/internal/donate/${request._id}`, {
                method: "PATCH",
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to confirm donation");
            }

            setRequest((prev) => ({
                ...prev,
                status: "In Progress",
                donorName: session.user.name,
                donorEmail: session.user.email,
            }));

            toast.success(
                "Thank you for volunteering! The requester will contact you soon.",
                { duration: 4000 }
            );

            close();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error confirming donation:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setDonating(false);
        }
    };

    if (sessionPending || !session) {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
                <div className="text-[#800020] font-bold text-lg animate-pulse">
                    Checking login status...
                </div>
            </div>
        );
    }

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
                    <Button className="bg-[#800020] text-white">Back to Requests</Button>
                </Link>
            </div>
        );
    }

    const status = request.status || "Pending";
    const isInProgress = status === "In Progress";

    const statusBadgeClass = isInProgress
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

    return (
        <>
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#FFF8F6] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href="/blood-donation"
                        className="inline-flex items-center gap-2 text-[#800020] hover:text-[#600018] font-semibold mb-8 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back to Requests
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="overflow-hidden border border-gray-100 bg-white">
                                <div className="bg-gradient-to-r from-[#FDF0F0] to-[#FFE8E8] p-8 border-b border-red-100">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h1 className="text-4xl font-bold text-[#800020]">
                                                {request.bloodGroup}
                                            </h1>
                                            <p className="text-gray-600 mt-2">Blood Group Required</p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 font-bold rounded-full border ${statusBadgeClass}`}
                                        >
                                            {isInProgress ? "🔄 In Progress" : "⏳ Pending"}
                                        </span>
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {request.recipientName}
                                    </h2>
                                    <p className="text-gray-700">
                                        Patient Record:{" "}
                                        <span className="font-semibold">
                                            {request._id?.slice(-6) || "N/A"}
                                        </span>
                                    </p>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
                                            Request Message
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="text-gray-800 leading-relaxed">
                                                {request.requestMessage ||
                                                    "Blood donation needed for medical procedure"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
                                            Hospital Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-[#800020] flex-shrink-0">
                                                    <FiMapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">
                                                        HOSPITAL NAME
                                                    </p>
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
                                                    <p className="text-xs text-gray-600 font-semibold">
                                                        LOCATION
                                                    </p>
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

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">
                                            Donation Timing
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">
                                                    DATE NEEDED
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {request.donationDate || "N/A"}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">
                                                    TIME NEEDED
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {request.donationTime || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {isInProgress && request.donorName && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
                                                Donor
                                            </h3>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <p className="text-gray-900 font-semibold">
                                                    {request.donorName}
                                                </p>
                                                <p className="text-sm text-gray-600">{request.donorEmail}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="overflow-hidden border border-gray-100 bg-white sticky top-8">
                                <div className="bg-gradient-to-br from-[#800020] to-[#600018] p-8 text-white text-center">
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2">Need</p>
                                    <h2 className="text-6xl font-black">{request.bloodGroup}</h2>
                                </div>

                                <div className="p-6 border-b border-gray-100">
                                    <p className="text-xs font-bold text-gray-700 uppercase mb-4">
                                        Requester
                                    </p>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Name</p>
                                            <p className="font-bold text-gray-900">
                                                {request.requesterName || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Email</p>
                                            <a
                                                href={`mailto:${request.requesterEmail}`}
                                                className="text-[#800020] font-semibold hover:underline text-sm break-all"
                                            >
                                                {request.requesterEmail || "N/A"}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <Modal>
                                        <Button
                                            onPress={() => setIsModalOpen(true)}
                                            isDisabled={isInProgress}
                                            className="w-full bg-[#800020] text-white font-bold py-3 rounded-xl hover:bg-[#600018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                                        >
                                            {isInProgress ? "Already In Progress" : "Donate Now"}
                                        </Button>

                                        <Modal.Backdrop isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                                            <Modal.Container>
                                                <Modal.Dialog>
                                                    {({ close }) => (
                                                        <>
                                                            <Modal.Header>
                                                                <Modal.Heading>Confirm Blood Donation</Modal.Heading>
                                                            </Modal.Header>

                                                            <Modal.Body className="space-y-4">
                                                                <p className="text-sm text-gray-600">
                                                                    নিচের তথ্য দিয়ে তুমি এই request এর জন্য
                                                                    donate করতে চাচ্ছো বলে confirm করছো।
                                                                </p>

                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                                        Donor Name
                                                                    </p>
                                                                    <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                                                                        {session.user.name}
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                                                                        Donor Email
                                                                    </p>
                                                                    <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                                                                        {session.user.email}
                                                                    </p>
                                                                </div>
                                                            </Modal.Body>

                                                            <Modal.Footer>
                                                                <Button slot="close" isDisabled={donating}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    className="bg-[#800020] text-white"
                                                                    onPress={() => handleConfirmDonation(close)}
                                                                    isDisabled={donating}
                                                                >
                                                                    {donating ? "Confirming..." : "Confirm"}
                                                                </Button>
                                                            </Modal.Footer>
                                                        </>
                                                    )}
                                                </Modal.Dialog>
                                            </Modal.Container>
                                        </Modal.Backdrop>
                                    </Modal>

                                    <p className="text-xs text-gray-500 text-center mt-3">
                                        {isInProgress
                                            ? "A donor has already confirmed this request"
                                            : "The requester will contact you with further details"}
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