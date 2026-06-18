"use client"

import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
    // উপরের স্ট্যাটিস্টিকস কার্ডের ডাটা
    const stats = [
        { value: '10k+', label: 'Registered Donors' },
        { value: '50k+', label: 'Lives Saved', highlight: true }, // এটি হাইলাইট করা কার্ড
        { value: '24/7', label: 'Emergency Support' },
        { value: '150+', label: 'Partner Hospitals' },
    ];

    // নিচের 'How It Works' কার্ডের ডাটা
    const steps = [
        {
            icon: 'account_circle',
            title: 'Register',
            description: 'Create your donor profile with health history and blood type information in minutes.'
        },
        {
            icon: 'notifications_active',
            title: 'Get Notified',
            description: 'Receive instant alerts when a local hospital or patient needs your specific blood type.'
        },
        {
            icon: 'bloodtype',
            title: 'Donate & Save',
            description: 'Visit our certified partner locations to complete your donation safely and efficiently.'
        }
    ];

    // অ্যানিমেশন সেটিংস
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="bg-rose-50 py-16 md:py-20 lg:py-24">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                {/* স্ট্যাটিস্টিকস কার্ড গ্রেড */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 md:mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className={`p-10 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-shadow duration-300 ${stat.highlight ? 'bg-red-800 text-white' : 'bg-white'}`}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            whileHover={{ scale: 1.05 }} // হোভার ইফেক্ট
                        >
                            <span className={`text-5xl font-extrabold mb-3 ${stat.highlight ? 'text-white' : 'text-red-900'}`}>{stat.value}</span>
                            <span className={`text-base font-medium tracking-tight ${stat.highlight ? 'text-red-100' : 'text-zinc-600'}`}>{stat.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* 'How It Works' শিরোনাম এবং বর্ণনা */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-950 mb-6 tracking-tighter">How LifeDrop Works</h2>
                    <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
                        Our streamlined process ensures that every drop of blood reaches those in need with maximum efficiency and care.
                    </p>
                </div>

                {/* 'How It Works' কার্ড গ্রেড */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="p-8 bg-white/60 rounded-xl shadow-md border border-red-100/30 text-center"
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            whileHover={{ scale: 1.03 }} // হোভার ইফেক্ট
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-3.5 bg-rose-100 text-red-900 rounded-lg">
                                    <span className="material-symbols-outlined text-4xl text-red-800">{step.icon}</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-zinc-950 mb-5 tracking-tight">{step.title}</h3>
                            <p className="text-lg text-zinc-700 leading-relaxed font-normal">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;