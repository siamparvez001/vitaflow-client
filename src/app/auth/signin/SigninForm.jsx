"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { FiLogIn, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { BiSolidDroplet } from "react-icons/bi";

const SigninForm = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // আপনার অথেন্টিকেশন লজিক এখানে হবে (e.g., signIn from auth-client)
        console.log("Sign In Data:", formData);
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="flex min-h-[85vh] items-center justify-center px-4 py-8 bg-gray-50/50">
            {/* মেইন কন্টেইনার কার্ড */}
            <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 min-h-[550px]">

                {/* বামদিকের ব্যানার সেকশন (মোবাইলে হাইড থাকবে, ল্যাপটপ/ডেক্সটপে দেখাবে) */}
                <div className="hidden w-1/2 bg-[#7A1C2E] p-12 text-white md:flex flex-col justify-between relative">
                    <div>
                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
                            Every drop <br /> saves a life.
                        </h2>
                        <p className="text-sm text-red-100/80 font-medium leading-relaxed max-w-sm">
                            Join our premium blood donation network connecting donors with hospitals in real-time.
                        </p>
                    </div>

                    {/* নিচের ছোট ফিচার বক্সগুলো */}
                    <div className="space-y-3 mt-8">
                        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3.5 backdrop-blur-sm border border-white/5">
                            <FiCheckCircle className="text-xl text-red-200" />
                            <span className="text-sm font-semibold tracking-wide">Verified Clinical Protocols</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3.5 backdrop-blur-sm border border-white/5">
                            <BiSolidDroplet className="text-xl text-red-200" />
                            <span className="text-sm font-semibold tracking-wide">Urgent Emergency Response</span>
                        </div>
                    </div>
                </div>

                {/* ডানদিকের ফর্ম সেকশন */}
                <div className="w-full p-8 sm:p-12 md:w-1/2 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm font-medium text-gray-500">
                            Log in to your clinical portal dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* ইমেইল ইনপুট */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="name@hospital.com"
                                variant="bordered"
                                radius="md"
                                size="lg"
                                className="font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* পাসওয়ার্ড ইনপুট */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-xs font-bold text-[#7A1C2E] hover:underline"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <Input
                                type={isVisible ? "text" : "password"}
                                placeholder="••••••••"
                                variant="bordered"
                                radius="md"
                                size="lg"
                                className="font-medium"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                // endContent এর পরিবর্তে endcontent ব্যবহার করুন
                                endcontent={
                                    <button
                                        className="focus:outline-none text-gray-400 hover:text-gray-600 transition"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </button>
                                }
                            />
                        </div>

                        {/* লগইন বাটন */}
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full bg-[#7A1C2E] text-white font-bold text-sm h-12 rounded-xl shadow-lg shadow-red-900/10 hover:opacity-95 transition mt-2"
                            endContent={!isLoading && <FiLogIn size={16} />}
                        >
                            Login to Account
                        </Button>
                    </form>

                    {/* নিচের লিঙ্ক */}
                    <div className="mt-8 text-center">
                        <p className="text-sm font-semibold text-gray-600">
                            New to LifeDrop?{" "}
                            <Link href="/auth/signup" className="text-[#7A1C2E] font-bold hover:underline ml-1">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SigninForm;