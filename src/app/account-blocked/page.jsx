// src/app/account-blocked/page.jsx

"use client";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { signOut } from "@/lib/auth-client";

export default function AccountBlockedPage() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8F6] px-4">
            <Card className="max-w-md w-full p-8 border border-red-200 bg-white">
                <div className="text-center space-y-6">
                    <div className="text-6xl">🔒</div>
                    <h1 className="text-3xl font-bold text-[#800020]">
                        Account Blocked
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                        Your account has been blocked by an administrator. 
                        If you believe this is a mistake, please contact support.
                    </p>
                    <div className="space-y-3">
                        <Button
                            onPress={handleLogout}
                            className="w-full bg-[#800020] text-white font-semibold"
                        >
                            Logout
                        </Button>
                        <Button
                            onPress={() => router.push("/")}
                            variant="bordered"
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}