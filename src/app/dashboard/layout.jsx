// src/app/dashboard/layout.js
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { requireActiveDashboardAccess } from "@/lib/actions/roleCheck";

const DashboardLayout = async ({ children }) => {
    // ✅ লগইন + blocked status - দুটোই চেক করে। নির্দিষ্ট role চেক প্রতিটা
    // sub-page নিজে করবে (requireRole দিয়ে)।
    await requireActiveDashboardAccess();

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default DashboardLayout;