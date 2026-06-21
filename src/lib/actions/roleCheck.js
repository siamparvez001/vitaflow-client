// src/lib/actions/roleCheck.js
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * শুধু লগইন আছে কিনা চেক করে (role matter করে না)
 */
export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    return session;
}

/**
 * Login + Role + Blocked status — সব চেক করে।
 */
export async function requireRole(allowedRoles = []) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    if (session.user?.status === "Blocked") {
        redirect("/account-blocked");
    }

    const userRole = session.user?.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        redirect("/unauthorized");
    }

    return session;
}

/**
 * Dashboard layout এর জন্য - blocked check সহ, role matter করে না
 */
export async function requireActiveDashboardAccess() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    if (session.user?.status === "Blocked") {
        redirect("/account-blocked");
    }

    return session;
}

/**
 * Component-level এ (redirect না করে) শুধু true/false পেতে চাইলে।
 */
export function hasRole(session, allowedRoles = []) {
    if (!session?.user?.role) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(session.user.role);
}