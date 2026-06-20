// src/app/dashboard/all-users/page.js
import { requireRole } from "@/lib/actions/roleCheck";
import AllUsersPageClient from "./AllUsersPageClient";

export default async function AllUsersPage() {
    // ✅ শুধু Admin এই পেজে ঢুকতে পারবে।
    await requireRole(["Admin"]);

    return <AllUsersPageClient />;
}