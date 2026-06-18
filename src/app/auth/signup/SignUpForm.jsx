"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Card,
    Button,
    Avatar
} from '@heroui/react';
import { toast, Toaster } from 'react-hot-toast';

// React Icons
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineLocationMarker, HiOutlineMap, HiOutlineUpload, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';
import { GiBlood } from 'react-icons/gi';

import { authClient } from '@/lib/auth-client';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DISTRICTS = [
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'chattogram', label: 'Chattogram' }
];
const UPAZILAS = {
    dhaka: [{ value: 'gulshan', label: 'Gulshan' }, { value: 'dhanmondi', label: 'Dhanmondi' }],
    chattogram: [{ value: 'halishahar', label: 'Halishahar' }, { value: 'kotwali', label: 'Kotwali' }]
};

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const SignUpForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [loadingText, setLoadingText] = useState(null);
    const [role, setRole] = useState("donor")

    // Form State
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bloodGroup, setBloodGroup] = useState('');
    const [district, setDistrict] = useState('');
    const [upazila, setUpazila] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const upazilaOptions = district ? UPAZILAS[district] : [];

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!IMGBB_API_KEY) {
            toast.error('ImageBB API Key is missing in .env.local');
            return;
        }

        setLoadingText('Uploading avatar...');
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                setAvatarUrl(result.data.url);
                toast.success('Avatar uploaded successfully!');
            } else {
                throw new Error(result.error?.message || 'Failed to upload avatar.');
            }
        } catch (error) {
            toast.error(error.message || 'Avatar upload failed.');
        } finally {
            setLoadingText(null);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        // Debugging log to track empty states if something triggers
        console.log("Submitting:", { email, name, avatarUrl, bloodGroup, district, upazila, password });

        if (!email || !name || !avatarUrl || !bloodGroup || !district || !upazila || !password) {
            toast.error("All fields are required!");
            return;
        }

        setLoadingText('Creating account...');

        startTransition(async () => {
            try {
                const { data, error } = await authClient.signUp.email({
                    email,
                    password,
                    name,
                    role,
                    district,
                    upazila,
                    image: avatarUrl,
                    data: {
                        bloodGroup,
                        district,
                        upazila,
                    },
                    callbackURL:"/"
                });

                if (error) {
                    toast.error(error.message || 'Registration failed.');
                    setLoadingText(null);
                    return;
                }

                toast.success('Success! Welcome to LifeDrop.');
                setTimeout(() => {
                    router.push('/');
                }, 1500);

            } catch (err) {
                setLoadingText(null);
                toast.error('An unexpected error occurred.');
            }
        });
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gray-50">
                <Card className="flex flex-col md:flex-row w-[1280px] max-w-full h-auto md:h-[760px] rounded-2xl shadow-xl overflow-hidden border border-gray-100" variant="default">

                    {/* Left Panel */}
                    <div className="w-full md:w-1/2 bg-[#8B002B] p-12 md:p-16 flex flex-col text-white justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">Every drop saves a life.</h1>
                            <p className="text-lg md:text-xl leading-relaxed max-w-[480px] opacity-90">
                                Join our premium blood donation network connecting donors with hospitals in real-time.
                            </p>
                        </div>

                        <div className="space-y-6 mt-8 md:mt-0">
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl flex items-center gap-4">
                                <HiOutlineCheckCircle className="text-2xl text-white" />
                                <p className="text-lg font-medium">Verified Clinical Protocols</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl flex items-center gap-4">
                                <HiOutlineClock className="text-2xl text-white" />
                                <p className="text-lg font-medium">Urgent Emergency Response</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Form */}
                    <div className="w-full md:w-1/2 bg-white flex flex-col h-full">
                        <Card.Content className="px-8 md:px-16 py-12 flex flex-col gap-6 overflow-y-auto flex-grow justify-center">

                            <Card.Header className="p-0 flex flex-col gap-1 items-start">
                                <Card.Title className="text-3xl md:text-4xl font-bold text-gray-900">Welcome back</Card.Title>
                                <Card.Description className="text-md md:text-lg text-gray-500">Register to your clinical portal dashboard.</Card.Description>
                            </Card.Header>

                            <form onSubmit={handleSignUp} className="flex flex-col gap-5 w-full">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                                    <div className="relative group">
                                        <Avatar
                                            src={avatarUrl || null}
                                            fallback={<HiOutlineUser className="text-gray-400 text-3xl" />}
                                            className={`w-20 h-20 text-large border-2 ${avatarUrl ? "border-success" : "border-gray-200"}`}
                                        />
                                        <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                            <HiOutlineUpload className="text-white text-xl" />
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={isPending}
                                            className="hidden"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Profile Avatar</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {loadingText && loadingText.includes('avatar') ? loadingText : 'Click profile photo to upload image to ImageBB'}
                                        </p>
                                    </div>
                                </div>

                                {/* Identity Block */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10 text-gray-400 text-lg"><HiOutlineUser /></span>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#8B002B] text-gray-800 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10 text-gray-400 text-lg"><HiOutlineMail /></span>
                                            <input
                                                type="email"
                                                placeholder="name@hospital.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#8B002B] text-gray-800 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Medical & Regional Categorization */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">Blood Group</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10"><GiBlood className="text-red-500 text-lg" /></span>
                                            <select
                                                value={bloodGroup}
                                                onChange={(e) => setBloodGroup(e.target.value)}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#8B002B] transition-colors cursor-pointer text-gray-800"
                                            >
                                                <option value="">Select</option>
                                                {BLOOD_GROUPS.map((group) => (
                                                    <option key={group} value={group}>{group}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">District</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10"><HiOutlineMap className="text-gray-400 text-lg" /></span>
                                            <select
                                                value={district}
                                                onChange={(e) => {
                                                    setDistrict(e.target.value);
                                                    setUpazila('');
                                                }}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#8B002B] transition-colors cursor-pointer text-gray-800"
                                            >
                                                <option value="">Select</option>
                                                {DISTRICTS.map((dist) => (
                                                    <option key={dist.value} value={dist.value}>{dist.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">Upazila</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10"><HiOutlineLocationMarker className="text-gray-400 text-lg" /></span>
                                            <select
                                                value={upazila}
                                                onChange={(e) => setUpazila(e.target.value)}
                                                disabled={!district}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#8B002B] transition-colors cursor-pointer text-gray-800 disabled:opacity-50 disabled:bg-gray-50"
                                            >
                                                <option value="">Select</option>
                                                {upazilaOptions.map((upa) => (
                                                    <option key={upa.value} value={upa.value}>{upa.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Security Constraints */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">Password</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10 text-gray-400 text-lg"><HiOutlineLockClosed /></span>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#8B002B] text-gray-800 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 z-10 text-gray-400 text-lg"><HiOutlineLockClosed /></span>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#8B002B] text-gray-800 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="bg-[#8B002B] text-white py-6 rounded-xl text-md font-semibold mt-4 transition-transform active:scale-[0.98] w-full"
                                    isLoading={isPending || (loadingText && !loadingText.includes('avatar'))}
                                >
                                    {loadingText && !loadingText.includes('avatar') ? loadingText : 'Register Clinical Portal'}
                                </Button>
                            </form>
                        </Card.Content>

                        <Card.Footer className="flex items-center justify-center py-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="font-bold text-[#8B002B] hover:underline ml-1">
                                    Sign in
                                </Link>
                            </p>
                        </Card.Footer>
                    </div>

                </Card>
            </div>
        </>
    );
};

export default SignUpForm;