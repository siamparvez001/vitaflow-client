// ============================================
// FILE: src/hooks/useAuth.js
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { 
    getAccessToken, 
    getUser, 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    verifyToken,
    clearTokens 
} from '@/lib/jwtClient';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (isAuthenticated()) {
                    // Verify token with backend
                    const verifiedUser = await verifyToken();
                    if (verifiedUser) {
                        setUser(verifiedUser);
                    } else {
                        clearTokens();
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth init error:', err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // ============= LOGIN HANDLER =============
    const handleLogin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await login(email, password);
            if (result.success) {
                setUser(result.user);
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    // ============= REGISTER HANDLER =============
    const handleRegister = async (name, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await register(name, email, password);
            if (result.success) {
                setUser(result.user);
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    // ============= LOGOUT HANDLER =============
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };
};