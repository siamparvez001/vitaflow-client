"use client";
import React, { useState, useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { Input, Button } from "@heroui/react";
import { FiEdit2, FiSave, FiCamera, FiEye, FiDownload, FiCheckCircle } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";
// import { getLoggedInUserProfile } from "@/lib/api/users";

const DISTRICTS = [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'chattogram', label: 'Chattogram' },
    { value: 'sylhet', label: 'Sylhet' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'khulna', label: 'Khulna' },
    { value: 'barisal', label: 'Barisal' }
];

const UPAZILAS = {
    dhaka: [
        { value: 'savar', label: 'Savar' },
        { value: 'mirpur', label: 'Mirpur' },
        { value: 'dhanmondi', label: 'Dhanmondi' },
        { value: 'uttara', label: 'Uttara' },
        { value: 'gulshan', label: 'Gulshan' },
        { value: 'paltan', label: 'Paltan' }
    ],
    chattogram: [
        { value: 'halishahar', label: 'Halishahar' },
        { value: 'kotwali', label: 'Kotwali' },
        { value: 'bayazid', label: 'Bayazid' }
    ],
    sylhet: [
        { value: 'sunamganj', label: 'Sunamganj' },
        { value: 'moulvibazar', label: 'Moulvibazar' }
    ],
    rajshahi: [
        { value: 'bogura', label: 'Bogura' },
        { value: 'natore', label: 'Natore' }
    ],
    khulna: [
        { value: 'jessore', label: 'Jessore' },
        { value: 'satkhira', label: 'Satkhira' }
    ],
    barisal: [
        { value: 'pirojpur', label: 'Pirojpur' },
        { value: 'jhalokati', label: 'Jhalokati' }
    ]
};

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function UserProfile({ initialDbData }) {
    const { data: session, refetch: refetchSession } = useSession();
    const user = session?.user;

    // States
    const [isEditable, setIsEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState(null);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        image: "",
        bloodGroup: "",
        district: "",
        upazila: "",
        title: "",
        donorStatus: "",
        visibility: true
    });

    // Load user data from session when it's available
    useEffect(() => {
        if (user) {
            setProfileData({
                // সেশন থেকে আসা বেসিক ডেটা
                name: user.name || "",
                email: user.email || "",
                image: user.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80",

                // সার্ভার (initialDbData) থেকে আসা ডাটাবেজের রিয়েল ডেটা
                bloodGroup: initialDbData?.bloodGroup || "O+",
                district: initialDbData?.district || "dhaka",
                upazila: initialDbData?.upazila || "dhanmondi",
                title: initialDbData?.title || "Clinical Administrator • Central Region Hospital",
                donorStatus: initialDbData?.donorStatus || "Active Donor",
                visibility: initialDbData?.visibility !== false
            });
        }
    }, [user, initialDbData]);

    const upazilaOptions = profileData.district ? UPAZILAS[profileData.district] : [];

    // Image Upload Handler
    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!IMGBB_API_KEY) {
            toast.error('ImageBB API Key is missing in .env.local');
            return;
        }

        setLoadingText('Uploading image...');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                setProfileData(prev => ({ ...prev, image: result.data.url }));
                toast.success('Image uploaded successfully!');
            } else {
                throw new Error(result.error?.message || 'Failed to upload image.');
            }
        } catch (error) {
            toast.error(error.message || 'Image upload failed.');
        } finally {
            setLoadingText(null);
        }
    };

    // Input Change Handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
            // Reset upazila if district changes
            ...(name === 'district' && { upazila: '' })
        }));
    };

    // Save Profile Handler
    // Save Profile Handler (UserProfile.jsx এর ভেতরে)
    // Save Profile Handler (UserProfile.jsx ফাইলের ভেতরে)
    const handleSave = async (e) => {
        e.preventDefault();

        if (!profileData.bloodGroup || !profileData.district || !profileData.upazila) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        setLoadingText('Saving profile...');

        // ১. এখানে baseUrl টি নিয়ে নিলাম (যদি env ফাইলে না থাকে তবে সরাসরি localhost:5000 পাবে)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

        try {
            // ২. fetch কলটিতে সম্পূর্ণ URL দিয়ে দেওয়া হলো
            const response = await fetch(`${baseUrl}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: profileData.email, // ব্যাকএন্ডের ইউজার চেনার জন্য ইমেইল
                    name: profileData.name,
                    image: profileData.image,
                    data: {
                        bloodGroup: profileData.bloodGroup,
                        district: profileData.district,
                        upazila: profileData.upazila,
                        title: profileData.title,
                        donorStatus: profileData.donorStatus,
                        visibility: profileData.visibility
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const data = await response.json();

            // Refetch session to update user data
            await refetchSession();

            setIsEditable(false);
            toast.success('Profile updated successfully!');
            console.log("Profile saved:", data);

        } catch (error) {
            toast.error(error.message || 'Failed to save profile');
            console.error('Save error:', error);
        } finally {
            setIsLoading(false);
            setLoadingText(null);
        }
    };

    const getDistrictLabel = (value) => {
        return DISTRICTS.find(d => d.value === value)?.label || value;
    };

    const getUpazilaLabel = (value) => {
        if (!profileData.district) return value;
        const upazila = UPAZILAS[profileData.district]?.find(u => u.value === value);
        return upazila?.label || value;
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-[#FFF8F6] py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
                <div className="max-w-4xl w-full flex flex-col gap-6">

                    {/* ==================== ১. টপ হেডার কার্ড (ইউজার সামারি) ==================== */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                            {/* প্রোফাইল ইমেজ ও ক্যামেরা আইকন */}
                            <div className="relative group">
                                <Image
                                    // যদি profileData.image থাকে তবে সেটা দেখাবে, না থাকলে ডামি ইমেজ দেখাবে
                                    src={profileData.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200&q=80"}
                                    alt={profileData.name || "User Avatar"}
                                    width={200}
                                    height={200}
                                    className="rounded-full object-cover border-4 border-red-50"
                                    priority
                                />
                                {isEditable && (
                                    <>
                                        <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiCamera className="text-white text-xl" />
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={isLoading}
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>

                            {/* ইউজার ইনফো */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
                                <p className="text-sm text-gray-500 font-medium mb-3">{profileData.title}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                    <span className="px-3 py-1 text-xs font-bold bg-red-50 text-[#800020] rounded-full">
                                        Blood Type: {profileData.bloodGroup}
                                    </span>
                                    <span className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full">
                                        {profileData.donorStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* এডিট/সেভ বাটন */}
                        {!isEditable ? (
                            <Button
                                onClick={() => setIsEditable(true)}
                                className="bg-[#800020] text-white font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-[#600018] flex items-center gap-2"
                            >
                                <FiEdit2 className="size-4" /> Edit Profile
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-xl shadow-sm hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                <FiSave className="size-4" /> {loadingText || 'Save Profile'}
                            </Button>
                        )}
                    </div>

                    {/* ==================== २. পার্সোনাল ইনফরমেশন ফর্ম সেকশন ==================== */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                <p className="text-xs text-gray-400 mt-1">
                                    ⓘ Click 'Edit Profile' to modify your information. Email cannot be changed.
                                </p>
                            </div>
                            <div className="p-2 bg-rose-50 text-[#800020] rounded-full">
                                <FiEye className="size-4" />
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="flex flex-col gap-6 mt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                                {/* ফুল নেম */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">Full Name</label>
                                    <Input
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleChange}
                                        readOnly={!isEditable}
                                        variant={isEditable ? "bordered" : "flat"}
                                        disabled={!isEditable}
                                    />
                                </div>

                                {/* ইমেইল এড্রেস (পড়ুন শুধু) */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">Email Address (Read Only)</label>
                                    <Input
                                        name="email"
                                        value={profileData.email}
                                        readOnly
                                        variant="flat"
                                    />
                                </div>
                            </div>

                            {/* ব্লাড গ্রুপ, ডিস্ট্রিক্ট, উপজেলা */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                                {/* ব্লাড গ্রুপ */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">
                                        Blood Group <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        disabled={!isEditable}
                                        name="bloodGroup"
                                        value={profileData.bloodGroup}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-xl border-2 outline-none text-sm h-10 transition-colors font-medium ${isEditable
                                            ? "border-red-200 hover:border-red-400 focus:border-[#800020] cursor-pointer bg-white text-gray-900"
                                            : "border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
                                            }`}
                                    >
                                        <option value="">Select Blood Group</option>
                                        {BLOOD_GROUPS.map((group) => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* ডিস্ট্রিক্ট */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">
                                        District <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        disabled={!isEditable}
                                        name="district"
                                        value={profileData.district}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-xl border-2 outline-none text-sm h-10 transition-colors font-medium ${isEditable
                                            ? "border-red-200 hover:border-red-400 focus:border-[#800020] cursor-pointer bg-white text-gray-900"
                                            : "border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
                                            }`}
                                    >
                                        <option value="">Select District</option>
                                        {DISTRICTS.map((district) => (
                                            <option key={district.value} value={district.value}>{district.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* উপজেলা */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-foreground">
                                        Upazila <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        disabled={!isEditable || !profileData.district}
                                        name="upazila"
                                        value={profileData.upazila}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 rounded-xl border-2 outline-none text-sm h-10 transition-colors font-medium ${isEditable && profileData.district
                                            ? "border-red-200 hover:border-red-400 focus:border-[#800020] cursor-pointer bg-white text-gray-900"
                                            : "border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
                                            }`}
                                    >
                                        <option value="">Select Upazila</option>
                                        {upazilaOptions.map((upazila) => (
                                            <option key={upazila.value} value={upazila.value}>{upazila.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* পাবলিক ডোনার ভিজিবিলিটি টগল */}
                            <div className="bg-[#FDF0F0] border border-red-50 rounded-xl p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <FiEye className="text-[#800020] size-5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Public Donor Visibility</p>
                                        <p className="text-xs text-gray-500">Allow others to see your donor status in search results.</p>
                                    </div>
                                </div>

                                {/* টগল বাটন */}
                                <button
                                    type="button"
                                    disabled={!isEditable}
                                    onClick={() => setProfileData(prev => ({ ...prev, visibility: !prev.visibility }))}
                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${profileData.visibility ? "bg-[#800020]" : "bg-gray-300"
                                        } ${!isEditable ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    <div
                                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${profileData.visibility ? "translate-x-6" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ==================== ३. বটম স্ট্যাটস ও ব্যাজ সেকশন ==================== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {/* টোটাল ডোনেশন কাউন্টার কার্ড */}
                        <div className="md:col-span-1 bg-[#FDF0F0] border border-red-50 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[120px]">
                            <span className="text-xs font-bold text-gray-500 tracking-wide uppercase">Total Donations</span>
                            <div className="flex items-baseline justify-between mt-4">
                                <span className="text-4xl font-black text-[#800020]">12</span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+2 this year</span>
                            </div>
                        </div>

                        {/* ভেরিফাইড ব্যাজ মেডেল কার্ড */}
                        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
                                    <FiCheckCircle className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Verified Clinical Contributor</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">Level 3 Badge awarded on Oct 2023</p>
                                </div>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-[#800020] transition-colors cursor-pointer">
                                <FiDownload className="size-5" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}