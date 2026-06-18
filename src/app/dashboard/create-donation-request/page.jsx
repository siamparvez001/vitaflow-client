"use client";
import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Form, Input, TextArea, Button } from "@heroui/react";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { bloodRequest } from "@/lib/actions/blood_request";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export default function CreateDonationRequest() {
    const { data: session, isPending } = useSession();
    const user = session?.user;
    const [errors, setErrors] = useState({});
    const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
    const [bloodGroupError, setBloodGroupError] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedUpazila, setSelectedUpazila] = useState("");

    const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

    const districts = [
        { value: 'dhaka', label: 'Dhaka' },
        { value: 'chattogram', label: 'Chattogram' },
        { value: 'sylhet', label: 'Sylhet' },
        { value: 'rajshahi', label: 'Rajshahi' },
        { value: 'khulna', label: 'Khulna' },
        { value: 'barisal', label: 'Barisal' }
    ];

    const upazilas = {
        dhaka: [
            { value: 'savar', label: 'Savar' },
            { value: 'mirpur', label: 'Mirpur' },
            { value: 'dhanmondi', label: 'Dhanmondi' },
            { value: 'uttara', label: 'Uttara' },
            { value: 'gulshan', label: 'Gulshan' },
            { value: 'paltan', label: 'Paltan' }
        ],
        chattogram: [
            { value: 'halishahar', label: 'Halishahar' },
            { value: 'kotwali', label: 'Kotwali' },
            { value: 'bayazid', label: 'Bayazid' }
        ],
        sylhet: [
            { value: 'sunamganj', label: 'Sunamganj' },
            { value: 'moulvibazar', label: 'Moulvibazar' }
        ],
        rajshahi: [
            { value: 'bogura', label: 'Bogura' },
            { value: 'natore', label: 'Natore' }
        ],
        khulna: [
            { value: 'jessore', label: 'Jessore' },
            { value: 'satkhira', label: 'Satkhira' }
        ],
        barisal: [
            { value: 'pirojpur', label: 'Pirojpur' },
            { value: 'jhalokati', label: 'Jhalokati' }
        ]
    };

    const upazilaOptions = selectedDistrict ? upazilas[selectedDistrict] : [];


    // সাবমিশনের সময় লোডিং ট্র্যাকিং করার জন্য একটি স্টেট
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const newErrors = {};

        // ১. ব্লাড গ্রুপ ভ্যালিডেশন ও স্পেসিফিক টোস্ট
        if (!selectedBloodGroup) {
            newErrors.bloodGroup = "Blood group is required";
            setBloodGroupError("Please select a blood group");
            toast.error("Something went wrong");
        } else {
            setBloodGroupError("");
        }

        // ২. বাকি সব ফিল্ডের কাস্টম এরর চেকিং
        if (!data.recipientName) newErrors.recipientName = "Recipient name is required";
        if (!selectedDistrict) newErrors.recipientDistrict = "District is required";
        if (!selectedUpazila) newErrors.recipientUpazila = "Upazila is required";
        if (!data.hospitalName) newErrors.hospitalName = "Hospital name is required";
        if (!data.fullAddress) newErrors.fullAddress = "Full address is required";
        if (!data.donationDate) newErrors.donationDate = "Donation date is required";
        if (!data.donationTime) newErrors.donationTime = "Donation time is required";
        if (!data.requestMessage) newErrors.requestMessage = "Request message is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorKey = Object.keys(newErrors)[0];
            toast.error(
                `${newErrors[firstErrorKey]}! Please fill up all required fields.`
            );
            return;
        }

        setErrors({});
        setIsSubmitting(true); // লোডিং শুরু

        const finalRequestData = {
            recipientName: data.recipientName,
            hospitalName: data.hospitalName,
            fullAddress: data.fullAddress,
            donationDate: data.donationDate,
            donationTime: data.donationTime,
            requestMessage: data.requestMessage,
            bloodGroup: selectedBloodGroup,
            district: selectedDistrict,
            upazila: selectedUpazila,
            requesterName: user?.name || "Anonymous User",
            requesterEmail: user?.email || "user@example.com",
            status: "pending",
        };

       

        try {
            
            const res = await bloodRequest(finalRequestData)
            

            if (res.insertedId) {
                
                toast.success(
                    "Donation request posted and saved successfully."
                );
                
                
                e.target.reset();
                setSelectedBloodGroup("");
                setSelectedDistrict("");
                setSelectedUpazila("");
                redirect('/')
            } else {
                throw new Error("Failed to insert data");
            }

        } catch (error) {
            console.error("Submission error:", error);
            toast.error(
                "Something went wrong while connecting to the server."
            );
        } finally {
            setIsSubmitting(false); // লোডিং শেষ
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (!selectedBloodGroup) {
    //         setBloodGroupError("Please select a blood group");
    //         return;
    //     }
    //     setBloodGroupError("");

    //     const formData = new FormData(e.currentTarget);
    //     const data = Object.fromEntries(formData.entries());

    //     const finalRequestData = {
    //         ...data,
    //         bloodGroup: selectedBloodGroup,
    //         district: selectedDistrict,
    //         upazila: selectedUpazila,
    //         requesterName: user?.name || "Anonymous User",
    //         requesterEmail: user?.email || "user@example.com",
    //         status: "pending",
    //     };

    //     console.log("Submitted Donation Request:", finalRequestData);
    // };
    if (isPending) {
        return <div>Loading...</div>
    }
    return (
        <div className="min-h-screen bg-[#FFF8F6] py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📑 বাম পাশের ইনফো প্যানেল */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-[#FDF0F0] border border-red-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[#800020] mb-4">Urgent & Composed</h2>
                        <p className="text-sm text-gray-700 leading-relaxed mb-6">
                            Every blood donation request is a critical link in the chain of survival.
                            Please provide precise clinical details to help our donor community respond effectively.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <FiCheckCircle className="text-[#800020] mt-0.5 shrink-0 size-4" />
                                <span>Ensure hospital address is complete.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <FiCheckCircle className="text-[#800020] mt-0.5 shrink-0 size-4" />
                                <span>Double check the recipient's blood group.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative bg-gradient-to-br from-[#800020] to-[#4A0012] rounded-2xl p-6 text-white overflow-hidden shadow-md min-h-[160px] flex flex-col justify-end">
                        <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full">
                            Impact Report
                        </span>
                        <h3 className="text-xl font-bold">1,240 Lives Saved This Month</h3>
                    </div>
                </div>

                {/* 📝 মূল ফর্ম সেকশন */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                    <Form onSubmit={handleSubmit} validationBehavior="native" className="flex flex-col gap-6">

                        {/* ১. রিকোয়েস্টার সেকশন (Read Only) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <Input
                                label="Requester Name"
                                name="requesterName"
                                defaultValue={user?.name || "Loading..."}
                                readOnly
                                variant="flat"
                            />
                            <Input
                                label="Requester Email"
                                name="requesterEmail"
                                defaultValue={user?.email || "Loading..."}
                                readOnly
                                variant="flat"
                            />
                        </div>

                        <hr className="border-gray-100 my-2" />

                        {/* ২. পেশেন্ট ইনফরমেশন সেকশন */}
                        <h3 className="text-lg font-bold text-gray-800 -mb-2">Patient Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
                            <Input
                                required
                                label="Recipient Name"
                                name="recipientName"
                                placeholder="Full legal name"
                                variant="bordered"
                            />

                            {/* কাস্টম ব্লাড গ্রুপ বাটন গ্রিড */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-black">Blood Group <span className="text-danger">*</span></span>
                                <div className="grid grid-cols-4 gap-2">
                                    {bloodGroups.map((group) => (
                                        <button
                                            key={group}
                                            type="button"
                                            onClick={() => {
                                                setSelectedBloodGroup(group);
                                                setBloodGroupError("");
                                            }}
                                            className={`py-2 text-sm font-semibold border rounded-lg transition-all ${selectedBloodGroup === group
                                                ? "bg-[#800020] text-white border-[#800020]"
                                                : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            {group}
                                        </button>
                                    ))}
                                </div>
                                {bloodGroupError && (
                                    <span className="text-xs text-danger mt-1">{bloodGroupError}</span>
                                )}
                            </div>
                        </div>

                        {/* ড্রপডাউন সেকশন */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {/* ডিস্ট্রিক্ট সিলেক্ট */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-black">
                                    Recipient District <span className="text-danger">*</span>
                                </label>
                                <select
                                    required
                                    name="recipientDistrict" // ফর্ম ডাটা সহজে হ্যান্ডেল করার জন্য নেম ট্যাগ
                                    value={selectedDistrict || ""} // যদি ভ্যালু আনডিফাইন্ড বা খালি থাকে তবে ফলব্যাক স্ট্রিন ""
                                    onChange={(e) => {
                                        setSelectedDistrict(e.target.value);
                                        setSelectedUpazila(''); // জেলা পরিবর্তন করলে উপজেলা রিসেট
                                    }}
                                    className="w-full px-3 py-2 bg-white text-black rounded-xl border-2 border-default-200 hover:border-default-400 focus:border-[#800020] outline-none text-sm h-10 transition-colors cursor-pointer"
                                >
                                    <option value="">Select District</option>
                                    {districts && districts.map((district) => (
                                        // নিশ্চিত হয়ে নিন district.value এবং district.label আপনার ডাটা স্ট্রাকচারে আছে
                                        <option key={district.value} value={district.value}>
                                            {district.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* উপজেলা সিলেক্ট */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-black">
                                    Recipient Upazila <span className="text-danger">*</span>
                                </label>
                                <select
                                    required
                                    name="recipientUpazila"
                                    value={selectedUpazila || ""} // ভ্যালু ট্র্যাকিং ফিক্স
                                    onChange={(e) => setSelectedUpazila(e.target.value)}
                                    disabled={!selectedDistrict}
                                    className="w-full px-3 py-2 bg-white text-black rounded-xl border-2 border-default-200 hover:border-default-400 focus:border-[#800020] outline-none text-sm h-10 transition-colors cursor-pointer disabled:opacity-50 disabled:bg-gray-50"
                                >
                                    <option value="">Select Upazila</option>
                                    {upazilaOptions && upazilaOptions.map((upazila) => (
                                        <option key={upazila.value} value={upazila.value}>
                                            {upazila.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>ƒ

                        {/* হাসপাতাল ও ফুল এড্রেস */}
                        <h3 className="text-lg font-bold text-gray-800 -mb-2">Medical & Location Details</h3>
                        <Input
                            required
                            label="Hospital Name"
                            name="hospitalName"
                            placeholder="e.g. Dhaka Medical College Hospital"
                            variant="bordered"
                        />

                        <Input
                            required
                            label="Full Address"
                            name="fullAddress"
                            placeholder="Room no, Floor, Landmark"
                            variant="bordered"
                        />

                        <hr className="border-gray-100 my-2" />

                        {/* ৩. টাইমিং এবং মেসেজ সেকশন */}
                        <h3 className="text-lg font-bold text-gray-800 -mb-2">Timing & Message</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <Input
                                required
                                type="date"
                                label="Needed Date"
                                name="donationDate"
                                variant="bordered"
                            />
                            <Input
                                required
                                type="time"
                                label="Needed Time"
                                name="donationTime"
                                variant="bordered"
                            />
                        </div>

                        <TextArea
                            required
                            label="Request Message"
                            name="requestMessage"
                            placeholder="Briefly explain the urgency or special requirements..."
                            variant="bordered"
                            className="min-h-[100px]"
                        />

                        {/* ৪. অ্যাকশন বাটন সেকশন */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 w-full">
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button
                                    type="submit"
                                    className="bg-[#800020] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:bg-[#600018] flex items-center gap-2 w-full sm:w-auto"
                                >
                                    <FiSend className="size-4" /> Submit Request
                                </Button>

                                <Button
                                    type="button"
                                    variant="bordered"
                                    className="border-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50 w-full sm:w-auto"
                                >
                                    Save Draft
                                </Button>
                            </div>

                            <p className="text-xs text-gray-400 italic text-center sm:text-right max-w-[280px]">
                                This request will be broadcast to donors in the selected district immediately.
                            </p>
                        </div>

                    </Form>
                </div>

            </div>
        </div>
    );
}