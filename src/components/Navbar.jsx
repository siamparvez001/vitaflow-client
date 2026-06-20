"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button, Avatar, Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import { signOut, useSession } from "@/lib/auth-client";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";



export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, isPending } = useSession();
    console.log("Session data is navbar:", session, "Is pending:", isPending)
    const user = session?.user;


    const handleSignOut = async () => {
        const data = await signOut();

        console.log(data);
    };


    const navItems = [
        {
            label: "Donation Requests",
            href: "/donation-request",
        },
        {
            label: "Find Donors",
            href: "/search-donors",
        },
        {
            label: "Funding",
            href: "/funding",
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-red-100 bg-[#FCE8E9]/85 backdrop-blur-md">
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
                    {user ? (
                        <Dropdown>
                            <Dropdown.Trigger className="rounded-full">
                                <Avatar size="sm" aria-label="User menu">
                                    <Avatar.Image
                                        referrerPolicy="no-referrer"
                                        alt={user?.name}
                                        src={user?.image}
                                    />
                                    <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
                                </Avatar>
                            </Dropdown.Trigger>
                            <Dropdown.Popover>
                                <div className="px-3 pt-3 pb-1">
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm">
                                            <Avatar.Image alt={user?.name} src={user?.image} />
                                            <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0">
                                            <p className="text-sm leading-5 font-medium">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Dropdown.Menu
                                    onAction={(key) => console.log(`Selected: ${key}`)}
                                >
                                    <Dropdown.Item id="dashboard" textValue="Dashboard">
                                        <NextLink
                                            className="flex items-center gap-2 w-full"
                                            href={`/dashboard`}
                                        >
                                            <MdDashboard />
                                            <Label>Dashboard</Label>
                                        </NextLink>
                                    </Dropdown.Item>

                                    <Dropdown.Item id="profile" textValue="Profile">
                                        <NextLink
                                            className="flex items-center gap-2 w-full"
                                            href={`/dashboard/profile`}
                                        >
                                            <CgProfile />
                                            <Label>Profile</Label>
                                        </NextLink>
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        id="logout"
                                        textValue="Logout"
                                        variant="danger"
                                        onClick={handleSignOut}
                                    >
                                        <div className="flex items-center gap-2">
                                            <BiLogOut />
                                            <Label>Logout</Label>
                                        </div>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    ) : (
                        <>
                            <NextLink
                                href="/auth/signin"
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
                        </>
                    )}
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
                            href="/auth/signin"
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





