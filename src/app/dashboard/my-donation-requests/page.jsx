// src/app/dashboard/my-donation-requests/page.js
import { requireRole } from "@/lib/actions/roleCheck";
import { serverFetch } from "@/lib/core/server";
import MyDonationTableClient from "./MyDonationTableClient";

export default async function MyDonationRequestPage() {
    // ✅ শুধু Donor এই পেজে ঢুকতে পারবে।
    const session = await requireRole(["Donor"]);

    const userEmail = session.user.email;

    // ✅ serverFetch ব্যবহার করছি - automatically internal secret +
    // user email/role হেডার পাঠায়।
    const allRequest = await serverFetch(
        `/api/my-donation-requests?email=${userEmail}`
    );

    return <MyDonationTableClient initialRequests={allRequest} />;
}