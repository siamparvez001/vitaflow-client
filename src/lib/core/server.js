// src/lib/core/server.js
import { signInternalToken } from "./jwt";
import { getUserSession } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const handleResponse = async (res) => {
    if (!res.ok) {
        let message = `Request failed with status ${res.status}`;

        try {
            const errorBody = await res.json();
            message = errorBody.message || message;
        } catch {
            // body JSON না হলে default message ব্যবহার হবে
        }

        throw new ApiError(message, res.status);
    }

    return res.json();
};


const buildHeaders = async (extra = {}) => {
    const user = await getUserSession();

    const headers = {
        "x-internal-secret": process.env.INTERNAL_API_SECRET,
        ...extra,
    };

    if (user?.email) {
        headers["Authorization"] = `Bearer ${signInternalToken(user)}`;
    }

    return headers;
};

export const serverFetch = async (path) => {
    try {
        const headers = await buildHeaders();

        const res = await fetch(`${baseUrl}${path}`, {
            cache: "no-store",
            headers,
        });
        return await handleResponse(res);
    } catch (error) {
        if (error instanceof ApiError) throw error;

        console.error(`serverFetch failed for ${baseUrl}${path}:`, error.message);
        throw new Error(
            `Backend এর সাথে connect করা যায়নি (${baseUrl}${path})। Backend চালু আছে কিনা এবং NEXT_PUBLIC_BASE_URL সঠিক আছে কিনা চেক করো।`
        );
    }
};

export const serverMutation = async (path, data, method = "POST") => {
    try {
        const headers = await buildHeaders({ "Content-Type": "application/json" });

        const res = await fetch(`${baseUrl}${path}`, {
            method,
            headers,
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