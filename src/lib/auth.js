import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
    },
    hooks: {
        before: async (context) => {
            // ✅ Blocked user signin করতে পারবে না
            if (context.path === "/sign-in/email") {
                const email = context.body?.email;
                if (email) {
                    const user = await db.collection("user").findOne({ email });
                    if (user?.status === "Blocked") {
                        return {
                            error: {
                                status: 403,
                                message: "Your account has been blocked. Please contact support.",
                            },
                        };
                    }
                }
            }
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "Donor",
                input: false,
            },
            image: {
                type: "string",
                required: false,
                input: true,
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "Active",
                input: false,
            },
            data: {
                type: "object",
                required: false,
                input: true,
                fields: {
                    bloodGroup: {
                        type: "string",
                        required: false,
                    },
                    district: {
                        type: "string",
                        required: false,
                    },
                    upazila: {
                        type: "string",
                        required: false,
                    },
                }
            },
        },
    },
});