
import { getAllDonationRequest } from '@/lib/api/blood_request';
import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers"; 
const AllDonationRequestPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });


    const userId = session?.user?.id;


    const allRequest = userId ? await getAllDonationRequest(userId) : [];

    console.log("All Blood Requests for this user:", allRequest);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Blood Requests</h1>

            {allRequest.length === 0 ? (
                <p className="text-gray-500">No blood requests found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allRequest.map((request) => (
                        <div key={request._id} className="border p-4 rounded-xl shadow-sm bg-white">
                            <h3 className="font-bold text-lg text-gray-800">Patient: {request.recipientName}</h3>
                            <p className="text-sm text-gray-600">Blood Group: <span className="text-red-600 font-semibold">{request.bloodGroup}</span></p>
                            <p className="text-sm text-gray-600">Hospital: {request.hospitalName}</p>
                            <p className="text-sm text-gray-600">Status: <span className="capitalize px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">{request.status}</span></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllDonationRequestPage;