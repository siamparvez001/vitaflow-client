// app/blood-donation/page.js
// import DonationRequest from "@/components/DonationRequest";

import DonationRequest from "../donation-request/page";

export const metadata = {
  title: "Blood Donation Requests | VitaFlow",
  description: "Browse and respond to urgent blood donation requests",
};

export default function BloodDonationPage() {
  return <DonationRequest />;
}