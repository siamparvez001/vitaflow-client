// src/app/dashboard/all-blood-donation-request/page.js
import { requireRole } from "@/lib/actions/roleCheck";
import { serverFetch } from "@/lib/core/server";
import DonationRequestTableClient from "./DonationRequestTableClient";

export default async function AllBloodDonationRequestPage({ searchParams }) {
    const session = await requireRole(["Admin", "Volunteer"]);

    // ✅ URL এর ?page= এখানে server-component এ পড়ে backend এ পাঠাচ্ছি
    const params = await searchParams;
    const page = params?.page || "1";
    const status = params?.status;

    const query = new URLSearchParams({ page, limit: "5" });
    if (status) query.set("status", status);

    // ✅ backend এখন { data, total, page, totalPages } পাঠায়
    const result = await serverFetch(`/api/create-donation-request?${query.toString()}`);

    return (
        <DonationRequestTableClient
            initialRequests={result.data || []}
            totalPages={result.totalPages || 1}
            currentUserRole={session.user.role}
        />
    );
}