// src/app/dashboard/all-blood-donation-request/page.js
import { requireRole } from "@/lib/actions/roleCheck";
import { serverFetch } from "@/lib/core/server";
import DonationRequestTableClient from "./DonationRequestTableClient";

export default async function AllBloodDonationRequestPage() {
    // ✅ শুধু Admin আর Volunteer এই পেজে ঢুকতে পারবে, Donor না।
    // requireRole নিজেই session না থাকলে /auth/signin এ,
    // ভুল role হলে /unauthorized এ পাঠিয়ে দেয়।
    const session = await requireRole(["Admin", "Volunteer"]);

    // ✅ serverFetch ব্যবহার করছি - এটা automatically internal secret
    // + user email/role হেডার পাঠায়, যা Express backend যাচাই করে।
    const requests = await serverFetch("/api/create-donation-request");

    return (
        <DonationRequestTableClient
            initialRequests={requests}
            currentUserRole={session.user.role}
        />
    );
}