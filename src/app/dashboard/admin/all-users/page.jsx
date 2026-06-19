// app/dashboard/all-blood-donation-request/page.js
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import { checkRole } from "@/lib/roleCheck";  // ← import করো
import DonationRequestTableClient from "../../all-blood-donation-request/DonationRequestTableClient";
import { checkUserRole } from "@/lib/actions/roleCheck";
import AllUsersPageClient from "./AllUsersPageClient";
// import DonationRequestTableClient from "./DonationRequestTableClient";

export default async function Page() {
    // const getAllDonationRequest
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // ✅ checkRole function use করো
    if (!checkUserRole(session, ['Admin', 'Volunteer'])) {
        redirect('/dashboard');
    }
    return <AllUsersPageClient></AllUsersPageClient>
    // return <DonationRequestTableClient initialRequests={initialRequests} currentUserRole={currentUserRole}/>;
}