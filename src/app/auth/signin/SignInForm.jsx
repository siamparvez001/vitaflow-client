"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Card,
    Button,
    Spinner
} from '@heroui/react';
import { toast, Toaster } from 'react-hot-toast';

// React Icons
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

import { authClient } from '@/lib/auth-client';

const SignInForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("All fields are required!");
            return;
        }

        startTransition(async () => {
            try {
                const { data, error } = await authClient.signIn.email({
                    email,
                    password,
                    // আপনি চাইলে সফল লগইনের পর সরাসরি কোথায় যাবে তাও এখানে বলে দিতে পারেন
                    callbackURL: '/'
                });

                if (error) {
                    toast.error(error.message || 'Invalid email or password.');
                    return;
                }

                toast.success('Welcome back to LifeDrop!');

                // হোম পেজে রিডাইরেক্ট
                setTimeout(() => {
                    router.push('/');
                    router.refresh(); // স্টেট আপডেট করার জন্য রিফ্রেশ
                }, 1500);

            } catch (err) {
                toast.error('An unexpected error occurred.');
            }
        });
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex min-h-screen w-full items-center justify-center p-4 bg-gray-50">
                <Card className="flex flex-col md:flex-row w-[1280px] max-w-full h-auto md:h-[760px] rounded-2xl shadow-xl overflow-hidden border border-gray-100" variant="default">

                    {/* Left Panel - Sign Up পেজের সাথে মিল রেখে */}
                    <div className="w-full md:w-1/2 bg-[#8B002B] p-12 md:p-16 flex flex-col text-white justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-8">Every drop saves a life.</h1>
                            <p className="text-lg md:text-xl leading-relaxed max-w-[480px] opacity-90">
                                Sign in to access your premium clinical portal dashboard and connect with patients and donors.
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
                    <div className="w-full md:w-1/2 bg-white flex flex-col h-full justify-center">
                        <Card.Content className="px-8 md:px-16 py-12 flex flex-col gap-6 justify-center my-auto">

                            <Card.Header className="p-0 flex flex-col gap-1 items-start">
                                <Card.Title className="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back</Card.Title>
                                <Card.Description className="text-md md:text-lg text-gray-500">Sign in to your clinical portal dashboard.</Card.Description>
                            </Card.Header>

                            <form onSubmit={handleSignIn} className="flex flex-col gap-5 w-full mt-4">
                                {/* Email Field */}
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
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-700">Password</label>
                                        <Link href="/auth/forgot-password" className="text-xs font-semibold text-[#8B002B] hover:underline">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 z-10 text-gray-400 text-lg"><HiOutlineLockClosed /></span>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-[44px] pl-10 pr-3 rounded-xl border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#8B002B] text-gray-800 transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="bg-[#8B002B] text-white py-6 rounded-xl text-md font-semibold mt-4 transition-transform active:scale-[0.98] w-full flex items-center justify-center gap-2"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            <span>Signing in to Dashboard...</span>
                                        </>
                                    ) : (
                                        'Sign In To Dashboard'
                                    )}
                                </Button>



                            </form>
                        </Card.Content>

                        {/* Footer Form Toggle */}
                        <Card.Footer className="flex items-center justify-center py-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
                            <p className="text-sm text-gray-600">
                                Don't have an account yet?{' '}
                                <Link href="/auth/signup" className="font-bold text-[#8B002B] hover:underline ml-1">
                                    Register now
                                </Link>
                            </p>
                        </Card.Footer>
                    </div>

                </Card>
            </div>
        </>
    );
};

export default SignInForm;