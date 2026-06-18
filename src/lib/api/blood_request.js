const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllDonationRequest = async (userId, status = 'Active') => {
    const res = await fetch(`${baseUrl}/api/create-donation-request?userId=${userId}&status=${status}`)
    return res.json();
}