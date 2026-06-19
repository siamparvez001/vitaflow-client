// app/blood-donation/page.js
import DonationRequestClient from "@/components/DonationRequestClient";

export const metadata = {
  title: "Blood Donation Requests | VitaFlow",
  description: "Browse and respond to urgent blood donation requests",
};

export default function BloodDonationPage() {
  return <DonationRequestClient />;
}