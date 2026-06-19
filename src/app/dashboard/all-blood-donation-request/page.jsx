import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DonationRequestTableClient from "./DonationRequestTableClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default async function AllBloodDonationRequestPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/auth/login");
    }

    const allowedRoles = ["Admin", "Volunteer", "Donor"];

    if (!allowedRoles.includes(session.user.role)) {
        redirect("/dashboard");
    }

    // API Call
    const res = await fetch(
        `${baseUrl}/api/create-donation-request`,
        {
            cache: "no-store",
        }
    );

    const requests = await res.json();

    return (
        <DonationRequestTableClient
            initialRequests={requests}
            currentUserRole={session.user.role}
        />
    );
}