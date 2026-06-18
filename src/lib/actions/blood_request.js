"use server"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const bloodRequest = async (bloodRequestData) => {
    const res = await fetch(`${baseUrl}/api/create-donation-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bloodRequestData)
    })
    if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
    }

    return res.json();
}