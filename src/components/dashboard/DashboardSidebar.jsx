// src/components/dashboard/DashboardSidebar.jsx
"use client"
import { useSession, signOut } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiHome,
    FiUser,
    FiList,
    FiPlusCircle,
    FiUsers,
    FiCheckSquare,
    FiSettings,
    FiLogOut,
    FiMenu
} from "react-icons/fi";
import { Button, Drawer } from "@heroui/react";
import { useState } from "react";

export function DashboardSidebar() {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        setIsOpen(false);
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/signin");
                    router.refresh();
                },
            },
        });
    };

    if (isPending) {
        return <div className="p-4 text-sm text-gray-500">Loading sidebar...</div>;
    }

    const user = session?.user;

    // ✅ Role-based nav (নতুন কোড থেকে)
    const getNavItems = () => {
        const baseItems = [
            { icon: FiHome, href: "/dashboard", label: "Dashboard Home" },
            { icon: FiUser, href: "/dashboard/profile", label: "Profile" },
        ];

        if (user?.role === "Admin") {
            return [
                ...baseItems,
                { icon: FiCheckSquare, href: "/dashboard/all-blood-donation-request", label: "All Requests" },
                { icon: FiUsers, href: "/dashboard/all-users", label: "Manage Users" },
            ];
        }

        if (user?.role === "Volunteer") {
            return [
                ...baseItems,
                { icon: FiCheckSquare, href: "/dashboard/all-blood-donation-request", label: "All Requests" },
            ];
        }

        // Donor (default)
        return [
            ...baseItems,
            { icon: FiList, href: "/dashboard/my-donation-requests", label: "My Requests" },
            { icon: FiPlusCircle, href: "/dashboard/donor/create-donation-request", label: "Create Request" },
        ];
    };

    const navItems = getNavItems();

    const bottomItems = [
        { icon: FiSettings, href: "/dashboard/settings", label: "Settings" },
    ];

    const renderNavLinks = (items) => (
        <div className="flex flex-col gap-1.5">
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                ? "bg-[#B32D44] text-white shadow-md font-semibold"
                                : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                            }`}
                    >
                        <item.icon className={`size-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <>
            {/* 💻 Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#FFF9F9] border-r border-gray-100 p-4 justify-between sticky top-0 self-start">
                <div className="flex flex-col gap-6">
                    <div className="px-3 py-2">
                        <span className="text-xl font-black text-[#B32D44] tracking-wider">
                            <Link href="/">VitaFlow</Link>
                        </span>
                    </div>
                    {renderNavLinks(navItems)}
                </div>

                <div className="flex flex-col gap-1 border-t border-gray-200/60 pt-4 mt-auto">
                    {renderNavLinks(bottomItems)}

                    {user && (
                        <div className="flex items-center gap-3 px-4 py-3 my-2 bg-gray-50/80 rounded-xl border border-gray-100">
                            <div className="w-9 h-9 rounded-full bg-[#B32D44]/10 text-[#B32D44] flex items-center justify-center font-bold text-sm shrink-0">
                                {user.name ? user.name[0].toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-gray-950 truncate">{user.name}</span>
                                <span className="text-xs text-gray-500 truncate">{user.email}</span>
                            </div>
                        </div>
                    )}

                    {user && (
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
                        >
                            <FiLogOut className="size-5 text-gray-500" />
                            Sign Out
                        </button>
                    )}
                </div>
            </aside>

            {/* 📱 Mobile Header */}
            <div className="lg:hidden p-4 bg-[#FFF9F9] border-b border-gray-100 flex items-center justify-between w-full sticky top-0 z-50">
                <span className="text-lg font-bold text-[#B32D44]">VitaFlow</span>
                <Button onPress={() => setIsOpen(true)} isIconOnly variant="light" className="text-gray-700">
                    <FiMenu className="size-6" />
                </Button>
            </div>

            {/* 📱 Mobile Drawer */}
            <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="left" size="xs">
                <Drawer.Content className="bg-[#FFF9F9]">
                    <Drawer.Body className="flex flex-col justify-between h-full py-6 px-4">
                        <div className="flex flex-col gap-6">
                            <div className="px-3">
                                <span className="text-xl font-black text-[#B32D44]">VITAFLOW</span>
                            </div>
                            {renderNavLinks(navItems)}
                        </div>

                        <div className="flex flex-col gap-1 border-t border-gray-200/60 pt-4">
                            {renderNavLinks(bottomItems)}

                            {user && (
                                <div className="flex items-center gap-3 px-4 py-3 my-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-9 h-9 rounded-full bg-[#B32D44]/10 text-[#B32D44] flex items-center justify-center font-bold text-sm shrink-0">
                                        {user.name ? user.name[0].toUpperCase() : "U"}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-gray-950 truncate">{user.name}</span>
                                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                                    </div>
                                </div>
                            )}

                            {user && (
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
                                >
                                    <FiLogOut className="size-5 text-gray-500" />
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer>
        </>
    );
}
















// src/components/dashboard/DashboardSidebar.jsx
// "use client"
// import { useSession, signOut } from "@/lib/auth-client";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//     FiHome,
//     FiUser,
//     FiList,
//     FiPlusCircle,
//     FiUsers,
//     FiCheckSquare,
//     FiSettings,
//     FiLogOut,
//     FiMenu
// } from "react-icons/fi";
// import { Button, Drawer } from "@heroui/react";
// import React, { useState } from "react";

// export function DashboardSidebar() {
//     const { data: session, isPending } = useSession();
//     const pathname = usePathname();
//     const router = useRouter();
//     const [isOpen, setIsOpen] = useState(false);

//     // ✅ আগে শুধু href="/auth/signin" দিয়ে navigate হতো - signOut() কখনো
//     // call হতো না, তাই session আসলে শেষ হতো না ব্যাকগ্রাউন্ডে। এখন আগে
//     // signOut() কল হবে, তারপর redirect।
//     const handleSignOut = async () => {
//         setIsOpen(false);
//         await signOut({
//             fetchOptions: {
//                 onSuccess: () => {
//                     router.push("/auth/signin");
//                     router.refresh();
//                 },
//             },
//         });
//     };

//     if (isPending) {
//         return <div className="p-4 text-sm text-gray-500">Loading sidebar...</div>
//     }

//     const user = session?.user;

//     const navItems = [
//         { icon: FiHome, href: "/dashboard", label: "Dashboard Home" },
//         { icon: FiUser, href: "/dashboard/profile", label: "Profile" },
//         { icon: FiList, href: "/dashboard/my-donation-requests", label: "My Requests" },
//         { icon: FiPlusCircle, href: "/dashboard/donor/create-donation-request", label: "Create Request" },
//         { icon: FiCheckSquare, href: "/dashboard/all-blood-donation-request", label: "All Requests" },
//     ];

//     // ✅ শুধু Admin এর জন্য
//     if (user?.role === "Admin") {
//         navItems.push({
//             icon: FiUsers,
//             href: "/dashboard/all-users",
//             label: "Manage Users",
//         });
//     }

//     const bottomItems = [
//         { icon: FiSettings, href: "/dashboard/settings", label: "Settings" },
//     ];

//     const renderNavLinks = (items) => (
//         <div className="flex flex-col gap-1.5">
//             {items.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                     <Link
//                         key={item.label}
//                         href={item.href}
//                         onClick={() => setIsOpen(false)}
//                         className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
//                             ? "bg-[#B32D44] text-white shadow-md font-semibold"
//                             : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
//                             }`}
//                     >
//                         <item.icon className={`size-5 ${isActive ? "text-white" : "text-gray-500"}`} />
//                         {item.label}
//                     </Link>
//                 );
//             })}
//         </div>
//     );

//     return (
//         <>
//             {/* 💻 desktop sidebar */}
//             <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#FFF9F9] border-r border-gray-100 p-4 justify-between sticky top-0 self-start">
//                 <div className="flex flex-col gap-6">
//                     <div className="px-3 py-2">
//                         <span className="text-xl font-black text-[#B32D44] tracking-wider">
//                             <Link href={'/'}>VitaFlow</Link>
//                         </span>
//                     </div>
//                     {renderNavLinks(navItems)}
//                 </div>

//                 <div className="flex flex-col gap-1 border-t border-gray-200/60 pt-4 mt-auto">
//                     {renderNavLinks(bottomItems)}

//                     {user && (
//                         <div className="flex items-center gap-3 px-4 py-3 my-2 bg-gray-50/80 rounded-xl border border-gray-100">
//                             <div className="w-9 h-9 rounded-full bg-[#B32D44]/10 text-[#B32D44] flex items-center justify-center font-bold text-sm shrink-0">
//                                 {user.name ? user.name[0].toUpperCase() : "U"}
//                             </div>
//                             <div className="flex flex-col min-w-0">
//                                 <span className="text-sm font-bold text-gray-950 truncate">{user.name}</span>
//                                 <span className="text-xs text-gray-500 truncate">{user.email}</span>
//                             </div>
//                         </div>
//                     )}

//                     {/* ✅ Sign Out - এখন signOut() কল করে, শুধু navigate করে না */}
//                     {user && (
//                         <button
//                             onClick={handleSignOut}
//                             className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
//                         >
//                             <FiLogOut className="size-5 text-gray-500" />
//                             Sign Out
//                         </button>
//                     )}
//                 </div>
//             </aside>

//             {/* 📱 mobile dashboard bar */}
//             <div className="lg:hidden p-4 bg-[#FFF9F9] border-b border-gray-100 flex items-center justify-between w-full sticky top-0 z-50">
//                 <span className="text-lg font-bold text-[#B32D44]">VitaFlow</span>
//                 <Button onPress={() => setIsOpen(true)} isIconOnly variant="light" className="text-gray-700">
//                     <FiMenu className="size-6" />
//                 </Button>
//             </div>

//             {/* mobile drawer */}
//             <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="left" size="xs">
//                 <Drawer.Content className="bg-[#FFF9F9]">
//                     <Drawer.Body className="flex flex-col justify-between h-full py-6 px-4">
//                         <div className="flex flex-col gap-6">
//                             <div className="px-3">
//                                 <span className="text-xl font-black text-[#B32D44]">VITAFLOW</span>
//                             </div>
//                             {renderNavLinks(navItems)}
//                         </div>

//                         <div className="flex flex-col gap-1 border-t border-gray-200/60 pt-4">
//                             {renderNavLinks(bottomItems)}

//                             {user && (
//                                 <div className="flex items-center gap-3 px-4 py-3 my-2 bg-gray-50 rounded-xl border border-gray-100">
//                                     <div className="w-9 h-9 rounded-full bg-[#B32D44]/10 text-[#B32D44] flex items-center justify-center font-bold text-sm shrink-0">
//                                         {user.name ? user.name[0].toUpperCase() : "U"}
//                                     </div>
//                                     <div className="flex flex-col min-w-0">
//                                         <span className="text-sm font-bold text-gray-950 truncate">{user.name}</span>
//                                         <span className="text-xs text-gray-500 truncate">{user.email}</span>
//                                     </div>
//                                 </div>
//                             )}

//                             {user && (
//                                 <button
//                                     onClick={handleSignOut}
//                                     className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
//                                 >
//                                     <FiLogOut className="size-5 text-gray-500" />
//                                     Sign Out
//                                 </button>
//                             )}
//                         </div>
//                     </Drawer.Body>
//                 </Drawer.Content>
//             </Drawer>
//         </>
//     );
// }