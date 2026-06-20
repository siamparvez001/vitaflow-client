// ============================================
// FILE: src/lib/jwtClient.js
// ============================================

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// ============= TOKEN STORAGE =============
const TOKEN_KEY = 'vitaflow_access_token';
const REFRESH_TOKEN_KEY = 'vitaflow_refresh_token';
const USER_KEY = 'vitaflow_user';

// ============= GET TOKEN FROM STORAGE =============
export const getAccessToken = () => {
    if (typeof window === 'undefined') return null; // SSR safe
    return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// ============= SET TOKEN IN STORAGE =============
export const setTokens = (accessToken, refreshToken) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// ============= REMOVE TOKENS =============
export const clearTokens = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

// ============= SET USER DATA =============
export const setUser = (user) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// ============= GET USER DATA =============
export const getUser = () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// ============= CHECK IF AUTHENTICATED =============
export const isAuthenticated = () => {
    return !!getAccessToken();
};

// ============= LOGIN FUNCTION =============
export const login = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error('Login failed');
        }

        const data = await res.json();

        // Tokens save করো
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
};

// ============= REGISTER FUNCTION =============
export const register = async (name, email, password) => {
    try {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            throw new Error('Registration failed');
        }

        const data = await res.json();

        // Tokens save করো
        setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: error.message };
    }
};

// ============= LOGOUT FUNCTION =============
export const logout = async () => {
    try {
        const token = getAccessToken();
        if (token) {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearTokens();
    }
};

// ============= REFRESH TOKEN FUNCTION =============
export const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token');
        }

        const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await res.json();
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error('Token refresh error:', error);
        clearTokens();
        return null;
    }
};

// ============= API CALL WITH TOKEN =============
export const apiCall = async (endpoint, options = {}) => {
    let token = getAccessToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    try {
        let res = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Token expired হলে refresh করো
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                headers['Authorization'] = `Bearer ${newToken}`;
                res = await fetch(`${API_URL}${endpoint}`, {
                    ...options,
                    headers,
                });
            } else {
                throw new Error('Authentication failed');
            }
        }

        return res;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

// ============= VERIFY TOKEN =============
export const verifyToken = async () => {
    try {
        const res = await apiCall('/api/auth/verify');
        if (!res.ok) {
            throw new Error('Token verification failed');
        }
        const data = await res.json();
        setUser(data.user);
        return data.user;
    } catch (error) {
        console.error('Verify error:', error);
        clearTokens();
        return null;
    }
};