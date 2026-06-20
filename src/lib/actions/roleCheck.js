// src/lib/actions/roleCheck.js

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * শুধু লগইন check করে
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
 * Login + Role + Blocked check করে
 */
export async function requireRole(allowedRoles = []) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    // ✅ Blocked check
    if (session.user?.status === 'Blocked') {
        redirect("/account-blocked");
    }

    const userRole = session.user?.role;

    // allowedRoles খালি মানে শুধু লগইন থাকলেই যথেষ্ট
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        redirect("/unauthorized");
    }

    return session;
}

/**
 * Dashboard layout এর জন্য - blocked check সহ
 */
export async function requireActiveDashboardAccess() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    if (session.user?.status === 'Blocked') {
        redirect("/account-blocked");
    }

    return session;
}

/**
 * Component-level এ শুধু true/false পেতে চাইলে
 */
export function hasRole(session, allowedRoles = []) {
    if (!session?.user?.role) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(session.user.role);
}