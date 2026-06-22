import React from "react";
import AllUsersPageClient from "@/components/dashboard/AllUsersPageClient";
import { requireRole } from "@/lib/actions/roleCheck";

export const metadata = {
    title: "All Users - Admin Dashboard",
    description: "Manage all users",
};

export default async function AllUsersPage() {
    await requireRole(["Admin"]);

    return <AllUsersPageClient />;
}