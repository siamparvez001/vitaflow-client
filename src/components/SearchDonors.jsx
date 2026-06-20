"use client";

import React, { useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { FiSearch, FiMapPin, FiDroplet, FiMail, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";

export default function SearchDonors() {
    // ============= STATE MANAGEMENT =============
    const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // ============= BLOOD GROUPS =============
    const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

    // ============= DISTRICTS =============
    const districts = [
        { value: "dhaka", label: "Dhaka" },
        { value: "chattogram", label: "Chattogram" },
        { value: "sylhet", label: "Sylhet" },
        { value: "rajshahi", label: "Rajshahi" },
        { value: "khulna", label: "Khulna" },
        { value: "barisal", label: "Barisal" },
    ];

    // ============= UPAZILAS =============
    const upazilas = {
        dhaka: [
            { value: "savar", label: "Savar" },
            { value: "mirpur", label: "Mirpur" },
            { value: "dhanmondi", label: "Dhanmondi" },
            { value: "uttara", label: "Uttara" },
            { value: "gulshan", label: "Gulshan" },
            { value: "paltan", label: "Paltan" },
        ],
        chattogram: [
            { value: "halishahar", label: "Halishahar" },
            { value: "kotwali", label: "Kotwali" },
            { value: "bayazid", label: "Bayazid" },
        ],
        sylhet: [
            { value: "sunamganj", label: "Sunamganj" },
            { value: "moulvibazar", label: "Moulvibazar" },
        ],
        rajshahi: [
            { value: "bogura", label: "Bogura" },
            { value: "natore", label: "Natore" },
        ],
        khulna: [
            { value: "jessore", label: "Jessore" },
            { value: "satkhira", label: "Satkhira" },
        ],
        barisal: [
            { value: "pirojpur", label: "Pirojpur" },
            { value: "jhalokati", label: "Jhalokati" },
        ],
    };

    const upazilaOptions = selectedDistrict ? upazilas[selectedDistrict] : [];

    // ============= HANDLE SEARCH =============
    const handleSearch = async (e) => {
        e.preventDefault();

        // Validation
        if (!selectedBloodGroup) {
            toast.error("Please select a blood group");
            return;
        }
        if (!selectedDistrict) {
            toast.error("Please select a district");
            return;
        }
        if (!selectedUpazila) {
            toast.error("Please select an upazila");
            return;
        }

        setIsLoading(true);
        setHasSearched(true);

        try {
            const query = new URLSearchParams({
                bloodGroup: selectedBloodGroup,
                district: selectedDistrict,
                upazila: selectedUpazila,
            });

            // ✅ আগে সরাসরি Express কে (`http://localhost:5000/api/search-donors`)
            // ব্রাউজার থেকে কল করা হতো - কিন্তু Express এখন internal secret
            // ছাড়া কোনো request accept করে না। তাই এখন নিজের Next.js এর
            // internal route কল করছি, যেটা ভিতরে গিয়ে secret সহ Express কে
            // কল করে।
            const apiUrl = `/api/internal/search-donors?${query.toString()}`;

            console.log("🔍 Searching donors with URL:", apiUrl);
            console.log("📊 Query params:", {
                bloodGroup: selectedBloodGroup,
                district: selectedDistrict,
                upazila: selectedUpazila,
            });

            const res = await fetch(apiUrl);

            console.log("📡 API Response Status:", res.status, res.statusText);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("❌ API Error Response:", errorText);
                throw new Error(
                    `API Error: ${res.status} ${res.statusText}`
                );
            }

            const data = await res.json();
            console.log("✅ Donors received:", data.length, "donors");

            if (data.length === 0) {
                toast.error("No donors found with these criteria");
                setDonors([]);
            } else {
                toast.success(`Found ${data.length} donor(s)`);
                setDonors(data);
            }
        } catch (error) {
            console.error("❌ Search error:", error.message);

            // Better error messages
            if (error.message.includes("Failed to fetch")) {
                toast.error(
                    "Cannot connect to server. Please try again."
                );
            } else if (error.message.includes("API Error")) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong while searching");
            }

            setDonors([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ============= HANDLE RESET =============
    const handleReset = () => {
        setSelectedBloodGroup("");
        setSelectedDistrict("");
        setSelectedUpazila("");
        setDonors([]);
        setHasSearched(false);
    };

    return (
        <div className="min-h-screen bg-[#FFF8F6] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* ============= HEADER SECTION ============= */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Find a <span className="text-[#800020]">Donor</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Search for available blood donors in your area. Select your required blood group,
                        district, and upazila to find the nearest match.
                    </p>
                </div>

                {/* ============= SEARCH FORM CARD ============= */}
                <div className="bg-white shadow-lg border border-gray-100 rounded-2xl mb-8 p-6 sm:p-8">
                    <form onSubmit={handleSearch} className="flex flex-col gap-6">
                        {/* ============= FILTER INPUTS ============= */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Blood Group Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <FiDroplet className="text-[#800020]" />
                                    Blood Group <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {bloodGroups.map((group) => (
                                        <button
                                            key={group}
                                            type="button"
                                            onClick={() => setSelectedBloodGroup(group)}
                                            className={`py-2 text-sm font-semibold border rounded-lg transition-all ${
                                                selectedBloodGroup === group
                                                    ? "bg-[#800020] text-white border-[#800020]"
                                                    : "bg-white text-gray-800 border-gray-200 hover:border-[#800020]"
                                            }`}
                                        >
                                            {group}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* District Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <FiMapPin className="text-[#800020]" />
                                    District <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedDistrict || ""}
                                    onChange={(e) => {
                                        setSelectedDistrict(e.target.value);
                                        setSelectedUpazila("");
                                    }}
                                    className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg border-2 border-gray-200 hover:border-[#800020] focus:border-[#800020] outline-none text-sm transition-colors cursor-pointer font-medium"
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.value} value={district.value}>
                                            {district.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Upazila Selector */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    <FiMapPin className="text-[#800020]" />
                                    Upazila <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedUpazila || ""}
                                    onChange={(e) => setSelectedUpazila(e.target.value)}
                                    disabled={!selectedDistrict}
                                    className="w-full px-3 py-2.5 bg-white text-gray-900 rounded-lg border-2 border-gray-200 hover:border-[#800020] focus:border-[#800020] outline-none text-sm transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Upazila</option>
                                    {upazilaOptions.map((upazila) => (
                                        <option key={upazila.value} value={upazila.value}>
                                            {upazila.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ============= ACTION BUTTONS ============= */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                type="submit"
                                className="bg-[#800020] text-white font-semibold px-8 py-2.5 rounded-lg shadow-md hover:bg-[#600018] transition-colors flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" color="current" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <FiSearch className="size-4" />
                                        Search Donors
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                className="border-gray-300 text-gray-700 font-medium px-8 py-2.5 rounded-lg hover:bg-gray-50 transition-colors border-2"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                {/* ============= RESULTS SECTION ============= */}
                {isLoading && (
                    <div className="flex justify-center items-center py-16">
                        <Spinner size="lg" color="current" />
                    </div>
                )}

                {hasSearched && !isLoading && donors.length === 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 text-center">
                        <FiSearch className="size-12 text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium text-lg">
                            No donors found with your search criteria
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Try searching with different filters
                        </p>
                    </div>
                )}

                {donors.length > 0 && (
                    <div>
                        {/* Results Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Found <span className="text-[#800020]">{donors.length}</span> Donor
                                {donors.length !== 1 ? "s" : ""}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Blood Group: <span className="font-semibold">{selectedBloodGroup}</span> •
                                Location:{" "}
                                <span className="font-semibold">
                                    {selectedDistrict}, {selectedUpazila}
                                </span>
                            </p>
                        </div>

                        {/* Donors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {donors.map((donor) => (
                                <div
                                    key={donor._id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                                >
                                    <div className="p-6">
                                        {/* Donor Image */}
                                        <div className="flex justify-center mb-4">
                                            {donor.image ? (
                                                <Image
                                                    src={donor.image}
                                                    alt={donor.name}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-full object-cover border-4 border-[#800020]"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <FiUser className="size-10 text-gray-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Donor Info */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {donor.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                                                <FiDroplet className="text-[#800020]" />
                                                <span className="font-semibold text-[#800020]">
                                                    {donor.data?.bloodGroup || "N/A"}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Location Info */}
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                                            <p className="text-gray-700 flex items-center gap-2">
                                                <FiMapPin className="size-4 text-[#800020]" />
                                                <span>
                                                    {donor.data?.district || "N/A"},{" "}
                                                    {donor.data?.upazila || "N/A"}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2 border-t border-gray-200 pt-4">
                                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                                <FiMail className="size-4 text-gray-500" />
                                                <span className="break-all text-xs">
                                                    {donor.email}
                                                </span>
                                            </p>
                                            {donor.data?.title && (
                                                <p className="text-xs text-gray-600 bg-blue-50 rounded px-2 py-1 inline-block">
                                                    {donor.data.title}
                                                </p>
                                            )}
                                        </div>

                                        {/* Contact Button */}
                                        <button
                                            onClick={() => {
                                                window.location.href = `mailto:${donor.email}`;
                                            }}
                                            className="w-full bg-[#800020] text-white font-semibold mt-4 rounded-lg hover:bg-[#600018] transition-colors py-2"
                                        >
                                            Contact Donor
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}