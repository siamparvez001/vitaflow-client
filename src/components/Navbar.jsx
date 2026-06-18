"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button } from "@heroui/react";
import Image from "next/image";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {
            label: "Donation Requests",
            href: "/donation-requests",
        },
        {
            label: "Find Donors",
            href: "/find-donors",
        },
        {
            label: "Funding",
            href: "/funding",
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-red-100 bg-[#FCE8E9]/95 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Logo + Mobile Menu Button */}
                <div className="flex items-center gap-3">
                    <button
                        className="rounded-md p-2 text-zinc-800 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>

                    <NextLink
                        href="/"
                        className="flex items-center gap-2 text-3xl font-bold text-red-700 transition-colors hover:text-red-800"
                    >
                        <Image
                            src="/logo.jpeg"
                            alt="VitaFlow Logo"
                            width={60}
                            height={60}
                            priority
                        />

                        <span>VitaFlow</span>
                    </NextLink>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden items-center gap-10 md:flex">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <NextLink
                                href={item.href}
                                className="font-medium text-zinc-700 transition-colors hover:text-red-600"
                            >
                                {item.label}
                            </NextLink>
                        </li>
                    ))}
                </ul>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-6 md:flex">
                    <NextLink
                        href="/login"
                        className="font-medium text-zinc-700 transition-colors hover:text-red-600"
                    >
                        Login
                    </NextLink>

                    <Button
                        as={NextLink}
                        href="/register"
                        color="danger"
                        size="lg"
                        className="font-semibold"
                    >
                        Join as Donor
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="border-t border-red-100 bg-[#FCE8E9] md:hidden">
                    <div className="flex flex-col gap-4 px-4 py-5">
                        {navItems.map((item) => (
                            <NextLink
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium text-zinc-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </NextLink>
                        ))}

                        <NextLink
                            href="/login"
                            className="text-base font-medium text-zinc-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </NextLink>

                        <Button
                            as={NextLink}
                            href="/register"
                            color="danger"
                            fullWidth
                            onPress={() => setIsMenuOpen(false)}
                        >
                            Join as Donor
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}