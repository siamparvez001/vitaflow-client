import Link from "next/link";

const Footer = () => {
    // স্বয়ংক্রিয়ভাবে বর্তমান বছর দেখানোর জন্য, আপনি চাইলে সরাসরি "2024" ও লিখে দিতে পারেন
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms" },
    ];

    return (
        <footer className="bg-[#FCE8E9] py-10 sm:py-12 border-t border-red-900/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-0">

                    {/* বামদিকের অংশ: লোগো এবং কপিরাইট টেক্সট */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                        <Link href="/">
                            <h2 className="text-2xl font-black tracking-tight text-[#7A1C2E]">
                                VitaFlow
                            </h2>
                        </Link>
                        <p className="mt-2 text-sm font-bold text-gray-700/90">
                            © {currentYear} VitaFlow. Urgent yet Composed.
                        </p>
                    </div>

                    {/* ডানদিকের অংশ: নেভিগেশন লিঙ্কসমূহ */}
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-end">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-gray-700/90 transition-colors hover:text-[#7A1C2E]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;