"use client";

import { useState } from "react";
import Link from "next/link";
// lucide-react এর পরিবর্তে react-icons ইম্পোর্ট করা হয়েছে
import { FiMenu, FiX, FiLogOut, FiLayout } from "react-icons/fi"; 
import { MdOutlineDashboard } from "react-icons/md";
import { useSession, signOut } from "@/lib/auth-client";
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar 
} from "@heroui/react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const handleSignOut = async () => {
        await signOut();
    };

    // প্রধান নেভিগেশন লিঙ্কসমূহ
    const navLinks = [
        { name: "Donation Requests", href: "/donation-requests" },
        { name: "Funding", href: "/funding" },
    ];

    // রোল অনুযায়ী ড্যাশবোর্ড পাথ নির্ধারণ
    const getDashboardHref = () => {
        if (user?.role === "admin") return "/dashboard/admin";
        if (user?.role === "donor") return "/dashboard/donor";
        return "/dashboard/seeker";
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                
                {/* ১. লোগো এরিয়া */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-[#7A1C2E]">
                        LifeDrop
                    </span>
                </Link>

                {/* ২. ডেক্সটপ মেনু (মাঝখানে লিঙ্কসমূহ) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-gray-700 transition duration-200 hover:text-[#7A1C2E]"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* ৩. ডানদিকের অ্যাকশন বাটন / প্রোফাইল ড্রপডাউন (ডেক্সটপ) */}
                <div className="hidden md:flex items-center gap-4">
                    {isPending ? (
                        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                    ) : user ? (
                        /* ইউজার লগইন থাকলে ড্রপডাউন মেনু */
                        <Dropdown placement="bottom-end" className="p-1">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform border-[#7A1C2E]"
                                    color="danger"
                                    name={user.name}
                                    size="sm"
                                    src={user.image || undefined}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2 opacity-100 cursor-default">
                                    <p className="font-semibold text-xs text-gray-500">Signed in as</p>
                                    <p className="font-bold text-gray-800">{user.name}</p>
                                    <p className="font-medium text-xs text-gray-400">{user.email}</p>
                                </DropdownItem>
                                <DropdownItem 
                                    key="dashboard" 
                                    // react-icons এর আইকন ব্যবহার
                                    startContent={<MdOutlineDashboard size={18} />}
                                    textValue="Dashboard"
                                >
                                    <Link href={getDashboardHref()} className="w-full block">
                                        Dashboard
                                    </Link>
                                </DropdownItem>
                                <DropdownItem 
                                    key="logout" 
                                    color="danger" 
                                    className="text-danger"
                                    // react-icons এর আইকন ব্যবহার
                                    startContent={<FiLogOut size={16} />}
                                    onClick={handleSignOut}
                                    textValue="Log Out"
                                >
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        /* ইউজার লগইন না থাকলে লগইন ও জয়েন বাটন */
                        <div className="flex items-center gap-4">
                            <Link
                                href="/auth/signin"
                                className="text-sm font-bold text-gray-700 transition hover:text-[#7A1C2E]"
                            >
                                Login
                            </Link>
                            
                            {/* Hero UI Button */}
                            <Button
                                as={Link}
                                href="/auth/signup"
                                className="bg-[#7A1C2E] text-white font-bold px-5 rounded-xl hover:opacity-90 transition duration-200"
                            >
                                Join as Donor
                            </Button>
                        </div>
                    )}
                </div>

                {/* ৪. মোবাইল মেনু বাটন (হ্যামবার্গার) */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-gray-700 hover:text-[#7A1C2E] transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {/* react-icons এর আইকন ব্যবহার */}
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* ৫. রেসপনসিভ মোবাইল ড্রয়ার/মেনু */}
            <div
                className={`overflow-hidden transition-all duration-300 md:hidden bg-white border-t border-gray-100 ${
                    isMenuOpen ? "max-h-[450px]" : "max-h-0"
                }`}
            >
                <div className="space-y-2 px-4 py-4 shadow-inner">
                    {/* মোবাইল নেভিগেশন লিঙ্ক */}
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block rounded-xl px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#7A1C2E] transition"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="my-2 border-t border-gray-100" />

                    {/* মোবাইল অথেন্টিকেশন পার্ট */}
                    {user ? (
                        <div className="space-y-2 bg-gray-50 p-3 rounded-xl">
                            <div className="flex items-center gap-3 px-2 py-1">
                                <Avatar
                                    size="sm"
                                    name={user.name}
                                    src={user.image || undefined}
                                    className="border border-[#7A1C2E]"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                                </div>
                            </div>
                            <Link
                                href={getDashboardHref()}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                            >
                                {/* react-icons এর আইকন ব্যবহার */}
                                <MdOutlineDashboard size={18} /> Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleSignOut();
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left"
                            >
                                {/* react-icons এর আইকন ব্যবহার */}
                                <FiLogOut size={16} /> Log Out
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <Link
                                href="/auth/signin"
                                onClick={() => setIsMenuOpen(false)}
                                className="block rounded-xl border border-gray-200 py-3 text-center text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Login
                            </Link>

                            <Link
                                href="/auth/signup"
                                onClick={() => setIsMenuOpen(false)}
                                className="block rounded-xl bg-[#7A1C2E] py-3 text-center text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
                            >
                                Join as Donor
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;