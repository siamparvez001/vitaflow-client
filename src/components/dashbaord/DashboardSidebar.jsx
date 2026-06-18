"use client"
import { useSession } from "@/lib/auth-client";
import { LayoutSideContentLeft, Bell, Briefcase, Envelope, Gear, House, Magnifier, Person } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { FaUsers } from "react-icons/fa";


export function DashboardSidebar() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return <div>Loading...</div>
    }

    const user = session?.user;

    const navItems = [
        { icon: House, href: "/dashboard/volunteer", label: "Home" },
        { icon: Magnifier, href: "/dashboard/all-blood-donation-request", label: "Boold Request" },
        { icon: Bell, href: "/dashboard/create-donation-request", label: "Post A Blood Request" },
        { icon: FaUsers, href: "/dashboard/volunteer/company", label: "Manage Users" },
        
        { icon: Person, href: "/dashboard/profile", label: "Profile" },
        { icon: Gear, href: "/settings", label: "Settings" },
    ];

    const navContent = <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
            <Link
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                href={item.href}
            >
                <item.icon className="size-5 text-muted" />
                {item.label}
            </Link>
        ))}
    </nav>

    return (
        <>
            <aside className="hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-default p-4 lg:flex">
                {navContent}
                {user && (
                    <div className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground border-t border-default pt-4">
                        <div className="flex justify-between items-center">
                            <Person className="size-5 text-muted" />
                            {user.name}
                        </div>
                        <div>
                            {/* {user.email} */}
                        </div>
                    </div>
                )}
            </aside>
            <Drawer>
                <Button className="lg:hidden" variant="secondary">
                    <LayoutSideContentLeft />
                    Menu
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body className="flex flex-col h-full">
                                {navContent}
                                {user && (
                                    <div className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground border-t border-default pt-4">
                                        <div>
                                            <Person className="size-5 text-muted" />
                                            {user.name}
                                            <div>
                                                {user.email}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}