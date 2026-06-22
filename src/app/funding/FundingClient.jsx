"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

// ✅ Stripe publishable key দিয়ে একবার initialize করো — component এর বাইরে
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

// ============================================================
// CheckoutForm — Stripe CardElement + payment confirm
// ============================================================
function CheckoutForm({ amount, donorName, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.error("Stripe is not loaded yet. Please wait.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            toast.error("Card element not found.");
            return;
        }

        setProcessing(true);
        setCardError(null);

        try {
            // ১. Next.js internal route থেকে clientSecret নাও
            const intentRes = await fetch("/api/internal/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const intentData = await intentRes.json();

            if (!intentRes.ok || !intentData.clientSecret) {
                throw new Error(intentData.message || "Failed to create payment intent");
            }

            // ২. Stripe দিয়ে card payment confirm করো
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                intentData.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (stripeError) {
                setCardError(stripeError.message);
                toast.error(stripeError.message);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                // ৩. Payment সফল হলে database এ save করো
                const saveRes = await fetch("/api/internal/fundings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount,
                        donorName,
                        transactionId: paymentIntent.id,
                    }),
                });

                if (!saveRes.ok) {
                    const saveErr = await saveRes.json().catch(() => ({}));
                    throw new Error(saveErr.message || "Payment succeeded but failed to save record");
                }

                toast.success("Thank you for your contribution! 🩸");
                onSuccess();
            }
        } catch (err) {
            console.error("Payment error:", err.message);
            toast.error(err.message || "Payment failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Card Input */}
            <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Card Information
                </label>
                <div className="p-4 border-2 border-gray-200 rounded-xl bg-white focus-within:border-[#800020] transition-colors">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#1a1a1a",
                                    fontFamily: "inherit",
                                    "::placeholder": { color: "#aab7c4" },
                                },
                                invalid: { color: "#800020" },
                            },
                            hidePostalCode: true,
                        }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                    🧪 Test: <span className="font-mono">4242 4242 4242 4242</span> | Exp: 12/26 | CVC: 123
                </p>
            </div>

            {/* Card Error */}
            {cardError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-red-600 text-sm font-medium">{cardError}</p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="bg-[#800020] text-white font-bold py-3.5 rounded-xl hover:bg-[#600018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base w-full"
            >
                {processing ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    `Donate $${amount}`
                )}
            </button>
        </form>
    );
}

// ============================================================
// Main FundingClient Component
// ============================================================
export default function FundingClient() {
    const { data: session } = useSession();
    const user = session?.user;
    console.log("SESSION USER:", user);


    const [fundings, setFundings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Modal form state
    const [donorName, setDonorName] = useState("");
    console.log("DONOR NAME STATE:", donorName);
    const [selectedAmount, setSelectedAmount] = useState(10);
    const [customAmount, setCustomAmount] = useState("");
    const [step, setStep] = useState(1); // 1 = name+amount, 2 = card payment

    const presetAmounts = [5, 10, 25, 50, 100];
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

    // Funding list fetch
    const fetchFundings = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/internal/fundings");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setFundings(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load fundings:", error.message);
            setFundings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundings();
    }, []);

    // Modal open — session থেকে নাম pre-fill
    const handleOpenModal = () => {
        setDonorName(user?.name || "");
        setSelectedAmount(10);
        setCustomAmount("");
        setStep(1);
        setShowModal(true);
    };
    // const handleOpenModal = () => {
    // console.log("USER =", user);

    // setDonorName(user?.name || "");

    // console.log("NAME =", user?.name);

    //     setSelectedAmount(10);
    //     setCustomAmount("");
    //     setStep(1);
    //     setShowModal(true);
    // };

    const handleCloseModal = () => {
        setShowModal(false);
        setStep(1);
    };

    // Step 1 এ proceed করলে
    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (!donorName.trim()) {
            toast.error("Please enter your name");
            return;
        }
        if (!finalAmount || finalAmount < 1) {
            toast.error("Please select or enter a valid amount (minimum $1)");
            return;
        }
        setStep(2);
    };

    // Payment সফল হলে
    const handlePaymentSuccess = () => {
        handleCloseModal();
        fetchFundings(); // list refresh
    };

    // Stripe key না থাকলে error UI
    if (!publishableKey) {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                    <p className="text-red-600 font-bold text-lg mb-2">⚠️ Stripe Key Missing</p>
                    <p className="text-gray-600 text-sm">
                        <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> .env.local এ যোগ করো এবং dev server restart করো।
                    </p>
                </div>
            </div>
        );
    }

    const totalRaised = fundings.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);

    return (
        <>
            <Toaster position="top-right" />

            <div className="min-h-screen bg-[#FFF8F6] py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* ===== Header ===== */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Support <span className="text-[#800020]">VitaFlow</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Your contribution helps us maintain and improve our blood donation network,
                            connecting donors with those in need.
                        </p>
                    </div>

                    {/* ===== Give Fund Button ===== */}
                    <div className="flex justify-center mb-10">
                        {user ? (
                            <button
                                onClick={handleOpenModal}
                                className="bg-[#800020] text-white font-bold px-10 py-3.5 rounded-xl hover:bg-[#600018] transition-colors text-lg shadow-md flex items-center gap-2"
                            >
                                💝 Give Fund
                            </button>
                        ) : (
                            <a
                                href="/auth/signin"
                                className="bg-[#800020] text-white font-bold px-10 py-3.5 rounded-xl hover:bg-[#600018] transition-colors text-lg shadow-md inline-block"
                            >
                                Login to Donate
                            </a>
                        )}
                    </div>

                    {/* ===== Fundings Table ===== */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">All Contributions</h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Total raised:{" "}
                                    <span className="font-bold text-[#800020]">
                                        ${totalRaised.toFixed(2)}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">{fundings.length} contributions</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-gray-500">
                                <div className="animate-pulse text-lg">Loading contributions...</div>
                            </div>
                        ) : fundings.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                <p className="text-lg font-medium">No contributions yet.</p>
                                <p className="text-sm mt-1">Be the first to support VitaFlow! 💝</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Donor Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fundings.map((fund, index) => (
                                            <tr
                                                key={fund._id || index}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {fund.donorName || "Anonymous"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-200">
                                                        ${parseFloat(fund.amount || 0).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-sm">
                                                    {fund.createdAt
                                                        ? new Date(fund.createdAt).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== Donation Modal ===== */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
                    onClick={(e) => {
                        // backdrop click করলে modal বন্ধ
                        if (e.target === e.currentTarget) handleCloseModal();
                    }}
                >
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            ×
                        </button>

                        {/* Modal Header */}
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {step === 1 ? "💝 Make a Donation" : "💳 Payment"}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {step === 1
                                    ? "Choose an amount to support VitaFlow"
                                    : "Enter your card details to complete donation"}
                            </p>

                            {/* Step indicator */}
                            <div className="flex items-center gap-2 mt-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-[#800020] text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
                                <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-[#800020]" : "bg-gray-200"}`} />
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-[#800020] text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
                            </div>
                        </div>

                        {/* ===== STEP 1: Name + Amount ===== */}
                        {step === 1 && (
                            <form onSubmit={handleProceedToPayment} className="flex flex-col gap-5">

                                {/* Donor Name */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#800020] text-gray-900 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Preset Amounts */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                        Select Amount (USD) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-5 gap-2 mb-3">
                                        {presetAmounts.map((amt) => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAmount(amt);
                                                    setCustomAmount(""); // custom clear
                                                }}
                                                className={`py-2.5 text-sm font-bold border-2 rounded-xl transition-all ${selectedAmount === amt && !customAmount
                                                    ? "bg-[#800020] text-white border-[#800020]"
                                                    : "bg-white text-gray-800 border-gray-200 hover:border-[#800020] hover:text-[#800020]"
                                                    }`}
                                            >
                                                ${amt}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Amount */}
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            placeholder="Or enter custom amount"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                if (e.target.value) setSelectedAmount(null);
                                            }}
                                            min="1"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#800020] transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Summary Preview */}
                                {finalAmount > 0 && (
                                    <div className="bg-[#FDF0F0] border border-red-100 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Donation Summary</p>
                                        <p className="text-3xl font-black text-[#800020]">${finalAmount}</p>
                                        {donorName && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                as <span className="font-semibold">{donorName}</span>
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="bg-[#800020] text-white font-bold py-3.5 rounded-xl hover:bg-[#600018] transition-colors text-base w-full"
                                >
                                    Proceed to Payment →
                                </button>
                            </form>
                        )}

                        {/* ===== STEP 2: Stripe Card Payment ===== */}
                        {step === 2 && (
                            <div className="flex flex-col gap-4">
                                {/* Summary reminder */}
                                <div className="bg-[#FDF0F0] border border-red-100 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">You are donating</p>
                                    <p className="text-2xl font-black text-[#800020]">${finalAmount}</p>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        as <span className="font-semibold">{donorName}</span>
                                    </p>
                                </div>

                                {/* Stripe Elements wrapper */}
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm
                                        amount={finalAmount}
                                        donorName={donorName}
                                        onSuccess={handlePaymentSuccess}
                                    />
                                </Elements>

                                {/* Back button */}
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-gray-500 hover:text-gray-700 underline text-center transition-colors"
                                >
                                    ← Change amount or name
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}