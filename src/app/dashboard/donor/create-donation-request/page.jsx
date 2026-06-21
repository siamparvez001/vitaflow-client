"use client";
import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Form, Input, TextArea, Button } from "@heroui/react";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { bloodRequest } from "@/lib/actions/blood_request";
import toast from "react-hot-toast";


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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const newErrors = {};

        if (!selectedBloodGroup) {
            newErrors.bloodGroup = "Blood group is required";
            setBloodGroupError("Please select a blood group");
        } else {
            setBloodGroupError("");
        }

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
        setIsSubmitting(true);

        // ✅ userId এবং status এখানে পাঠানোর দরকার নেই — Express সার্ভার
        // নিজেই logged-in session থেকে userId/requesterEmail বসায়, এবং
        // status সবসময় "Pending" দিয়ে শুরু করে। client থেকে পাঠানো এই
        // ফিল্ডগুলো এখন সার্ভারে ignore হয় (নিরাপত্তার জন্য)।
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
        };

        try {
            const res = await bloodRequest(finalRequestData);

            if (res.insertedId) {
                toast.success("Donation request posted and saved successfully.");

                e.target.reset();
                setSelectedBloodGroup("");
                setSelectedDistrict("");
                setSelectedUpazila("");
            } else {
                throw new Error("Failed to insert data");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Something went wrong while connecting to the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

                        <h3 className="text-lg font-bold text-gray-800 -mb-2">Patient Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
                            <Input
                                required
                                label="Recipient Name"
                                name="recipientName"
                                placeholder="Full legal name"
                                variant="bordered"
                            />

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-black">
                                    Recipient District <span className="text-danger">*</span>
                                </label>
                                <select
                                    required
                                    name="recipientDistrict"
                                    value={selectedDistrict || ""}
                                    onChange={(e) => {
                                        setSelectedDistrict(e.target.value);
                                        setSelectedUpazila('');
                                    }}
                                    className="w-full px-3 py-2 bg-white text-black rounded-xl border-2 border-default-200 hover:border-default-400 focus:border-[#800020] outline-none text-sm h-10 transition-colors cursor-pointer"
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.value} value={district.value}>
                                            {district.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-black">
                                    Recipient Upazila <span className="text-danger">*</span>
                                </label>
                                <select
                                    required
                                    name="recipientUpazila"
                                    value={selectedUpazila || ""}
                                    onChange={(e) => setSelectedUpazila(e.target.value)}
                                    disabled={!selectedDistrict}
                                    className="w-full px-3 py-2 bg-white text-black rounded-xl border-2 border-default-200 hover:border-default-400 focus:border-[#800020] outline-none text-sm h-10 transition-colors cursor-pointer disabled:opacity-50 disabled:bg-gray-50"
                                >
                                    <option value="">Select Upazila</option>
                                    {upazilaOptions.map((upazila) => (
                                        <option key={upazila.value} value={upazila.value}>
                                            {upazila.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

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

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 w-full">
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button
                                    type="submit"
                                    isDisabled={isSubmitting}
                                    className="bg-[#800020] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md hover:bg-[#600018] flex items-center gap-2 w-full sm:w-auto disabled:opacity-50"
                                >
                                    <FiSend className="size-4" /> {isSubmitting ? "Submitting..." : "Submit Request"}
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