import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MyDonationTableClient from "./MyDonationTableClient"; // ক্লায়েন্ট ফাইলটি আলাদা করুন

const MyDonationRequestPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userEmail = session?.user?.email;

    // ব্যাকএন্ড থেকে এই ইমেইলের ডাটা আনা
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/my-donation-requests?email=${userEmail}`, {
        cache: 'no-store'
    });
    const allRequest = await res.json();

    return <MyDonationTableClient initialRequests={allRequest} />;
};

export default MyDonationRequestPage;