// ============================================
// FILE: src/components/ProtectedRoute.jsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@heroui/react';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                // Not logged in - redirect to login
                router.push('/auth/signin');
            } else if (requiredRole && user?.role !== requiredRole) {
                // Logged in but wrong role - redirect to home
                router.push('/');
            } else {
                // All good!
                setIsAuthorized(true);
            }
        }
    }, [isLoading, isAuthenticated, user, requiredRole, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return children;
};