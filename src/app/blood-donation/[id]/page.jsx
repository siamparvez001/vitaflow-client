// app/blood-donation/[id]/page.jsx
"use client";
import DonationRequestDetailClient from "@/components/DonationRequestDetailClient";

export default function DetailPage() {
    // ✅ params prop ব্যবহার করছি না — component নিজেই useParams() দিয়ে id বের করে নেয়
    return <DonationRequestDetailClient />;
}