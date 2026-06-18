"use client";


import { Button } from "@heroui/react";
import Image from "next/image";
import { FaHandHoldingHeart } from "react-icons/fa";

export default function HeroSection() {
    return (
        <section className="bg-[#FCE8E9]">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    {/* Left Content */}
                    <div>
                        <h1 className="max-w-xl text-5xl font-bold leading-tight text-zinc-900 lg:text-6xl">
                            Save Lives, One{" "}
                            <span className="text-danger">Drop</span> at a Time
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
                            VitaFlow connects voluntary blood donors with
                            hospitals and patients in real-time. Join a
                            community dedicated to saving lives through
                            compassionate healthcare.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Button
                                color="danger"
                                size="lg"
                                className="px-8 font-semibold"
                            >
                                Join as Donor
                            </Button>

                            <Button
                                variant="bordered"
                                size="lg"
                                className="border-danger px-8 font-semibold text-danger"
                            >
                                Search Donors
                            </Button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-3xl border-8 border-white shadow-2xl">
                            <Image
                                src="/hero.jpeg"
                                alt="Blood Donation"
                                width={700}
                                height={700}
                                priority
                                className="h-[500px] w-full object-cover"
                            />
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-8 left-0 rounded-2xl bg-white p-5 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
                                    <FaHandHoldingHeart className="text-2xl text-danger" />
                                </div>

                                <div>
                                    <h4 className="font-bold text-zinc-900">
                                        Urgent Need
                                    </h4>

                                    <p className="text-sm text-zinc-600">
                                        O-Negative Required
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}