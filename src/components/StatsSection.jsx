"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiBell, FiShield } from 'react-icons/fi'; // react-icons থেকে আইকন ইম্পোর্ট করা হয়েছে

const StatsSection = () => {
    // ১. উপরের স্ট্যাটিস্টিকস কার্ডের ডাটা
    const stats = [
        { value: '10k+', label: 'REGISTERED DONORS' },
        { value: '50k+', label: 'LIVES SAVED', highlight: true }, // হাইলাইটেড লাল কার্ড
        { value: '24/7', label: 'EMERGENCY SUPPORT' },
        { value: '150+', label: 'PARTNER HOSPITALS' },
    ];

    // ২. নিচের 'How LifeDrop Works' কার্ডের ডাটা (react-icons সহ)
    const steps = [
        {
            icon: <FiUserPlus className="w-6 h-6" />,
            title: 'Register',
            description: 'Create your donor profile with health history and blood type information in minutes.'
        },
        {
            icon: <FiBell className="w-6 h-6" />,
            title: 'Get Notified',
            description: 'Receive instant alerts when a local hospital or patient needs your specific blood type.'
        },
        {
            icon: <FiShield className="w-6 h-6" />,
            title: 'Donate & Save',
            description: 'Visit our certified partner locations to complete your donation safely and efficiently.'
        }
    ];

    // Framer Motion অ্যানিমেশন ভ্যারিয়েন্ট
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 } // একটির পর একটি কার্ড আসবে
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <section className="bg-[#FFF8F6] py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 📊 স্ট্যাটিস্টিকস গ্রিড (Responsive: ১ কলাম থেকে ৪ কলাম) */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className={`p-8 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center border border-gray-100/50 ${stat.highlight
                                    ? 'bg-[#B23242] text-white' // ইমেজ অনুসারে সেইম লাল কালার
                                    : 'bg-white text-gray-900'
                                }`}
                        >
                            <span className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                                {stat.value}
                            </span>
                            <span className={`text-xs font-bold tracking-wider ${stat.highlight ? 'text-rose-100' : 'text-gray-500'
                                }`}>
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* 🎯 শিরোনাম সেকশন */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        How LifeDrop Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Our streamlined process ensures that every drop of blood reaches those in need with maximum efficiency and care.
                    </p>
                </div>

                {/* 🛠️ কাজের ধাপের গ্রিড (Responsive: ১ কলাম থেকে ৩ কলাম) */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="flex flex-col items-center md:items-start text-center md:text-left group"
                        >
                            {/* আইকন কন্টেইনার - ব্যাকগ্রাউন্ড হালকা লাল */}
                            <div className="p-4 bg-[#FCE8E9] text-[#B23242] rounded-xl mb-6 transition-transform group-hover:scale-110 duration-300">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default StatsSection;