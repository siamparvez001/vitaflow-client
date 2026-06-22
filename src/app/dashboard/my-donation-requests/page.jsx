import React from "react";
import MyDonationRequestsClient from "@/components/dashboard/MyDonationRequestsClient";
import { requireRole } from "@/lib/actions/roleCheck";

export const metadata = {
    title: "My Donation Requests - VitaFlow",
    description: "View and manage your donation requests",
};

export default async function MyDonationRequestsPage() {
    await requireRole(["Donor"]);

    return <MyDonationRequestsClient />;
}