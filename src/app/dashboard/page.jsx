import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DonorDashboardHome from "@/components/dashboard/DonorDashboardHome";
import VolunteerDashboardHome from "@/components/dashboard/VolunteerDashboardHome";
import AdminDashboardHome from "@/components/dashboard/AdminDashboardHome";
// import AdminDashboardHome from "@/components/dashboard/AdminDashboardHome";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const role = session?.user?.role; // ডাটাবেজে ইউজারের রোল চেক করুন

    return (
        <div className="bg-[#FCE8E9] text-black min-h-screen">
            {role === 'Admin' && <AdminDashboardHome />}
            {role === 'Volunteer' && <VolunteerDashboardHome />}
            {role === 'Donor' && <DonorDashboardHome />}

            {/* যদি রোল না থাকে বা অন্য কিছু হয় */}
            {!role && <p>Loading or Access Denied...</p>}
        </div>
    );
}