// src/app/dashboard/page.js
import { requireAuth } from "@/lib/actions/roleCheck";
import DonorDashboardHome from "@/components/dashboard/DonorDashboardHome";
import VolunteerDashboardHome from "@/components/dashboard/VolunteerDashboardHome";
import AdminDashboardHome from "@/components/dashboard/AdminDashboardHome";

export default async function DashboardPage() {
    // ✅ লগইন ছাড়া কেউ /dashboard এ ঢুকতেই পারবে না।
    const session = await requireAuth();
    const role = session.user?.role;

    return (
        <div className="bg-[#FCE8E9] text-black min-h-screen">
            {role === "Admin" && <AdminDashboardHome />}
            {role === "Volunteer" && <VolunteerDashboardHome />}
            {role === "Donor" && <DonorDashboardHome />}
        </div>
    );
}