// src/app/dashboard/layout.js
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { requireActiveDashboardAccess } from "@/lib/actions/roleCheck";  // ✅ Change করলাম


const DashboardLayout = async ({ children }) => {
    
    await requireActiveDashboardAccess();  // ✅ Change করলাম

    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default DashboardLayout;