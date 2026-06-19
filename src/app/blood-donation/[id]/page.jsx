// app/blood-donation/[id]/page.jsx

"use client";
import DonationRequestDetailClient from "@/components/DonationRequestDetailClient";

export default function DetailPage({ params }) {
    return <DonationRequestDetailClient params={params} />;
}