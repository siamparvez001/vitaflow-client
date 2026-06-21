// app/blood-donation/[id]/page.jsx
"use client";
import DonationRequestDetailClient from "@/components/DonationRequestClient";

export default function DetailPage() {
    // ✅ params prop ব্যবহারই করছি না — component নিজেই useParams() দিয়ে id বের করবে
    return <DonationRequestDetailClient />;
}