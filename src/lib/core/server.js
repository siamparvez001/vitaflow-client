const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

// ✅ response status অনুযায়ী handle করা (401, 403, 404, অন্য সব error)
const handleResponse = async (res) => {
    if (!res.ok) {
        let message = `Request failed with status ${res.status}`;

        try {
            const errorBody = await res.json();
            message = errorBody.message || message;
        } catch {
            // response body JSON না হলে default message ব্যবহার হবে
        }

        if (res.status === 401) {
            throw new ApiError(message || 'Unauthorized', 401);
        }
        if (res.status === 403) {
            throw new ApiError(message || 'Forbidden', 403);
        }
        if (res.status === 404) {
            throw new ApiError(message || 'Not Found', 404);
        }

        throw new ApiError(message, res.status);
    }

    return res.json();
};

export const serverFetch = async (path) => {
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            cache: 'no-store', // server component এ সবসময় fresh ডাটা চাই
        });
        return await handleResponse(res);
    } catch (error) {
        if (error instanceof ApiError) throw error;

        // ✅ এই ব্লক ধরবে connection-level failure (backend বন্ধ, ভুল URL, DNS error ইত্যাদি)
        console.error(`serverFetch failed for ${baseUrl}${path}:`, error.message);
        throw new Error(
            `Backend এর সাথে connect করা যায়নি (${baseUrl}${path})। Backend চালু আছে কিনা এবং NEXT_PUBLIC_BASE_URL সঠিক আছে কিনা চেক করো।`
        );
    }
};

export const serverMutation = async (path, data, method = 'POST') => {
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await handleResponse(res);
    } catch (error) {
        if (error instanceof ApiError) throw error;

        console.error(`serverMutation failed for ${baseUrl}${path}:`, error.message);
        throw new Error(
            `Backend এর সাথে connect করা যায়নি (${baseUrl}${path})। Backend চালু আছে কিনা এবং NEXT_PUBLIC_BASE_URL সঠিক আছে কিনা চেক করো।`
        );
    }
};