"use client"
import { DashboardStats } from '@/components/dashbaord/DashboardStats';
import { useSession } from '@/lib/auth-client';
import { Briefcase, CircleCheck, Persons, Thunderbolt } from '@gravity-ui/icons';
import React from 'react';

const VolunteerDashboardHomePage = () => {
    const { data: session, isPending } = useSession()
    if (isPending) {
        return <div>Loading...</div>
    }


    const volunteerStats = [
        { title: "Total Job Posts", value: "48", icon: Briefcase },
        { title: "Total Applicants", value: "1,284", icon: Persons },
        { title: "Active Jobs", value: "18", icon: Thunderbolt },
        { title: "Jobs Closed", value: "32", icon: CircleCheck },
    ];

    const user = session?.user;
    console.log("Session data in RecruiterDashboardHomePage:", session);
    return (
        <div>
            <h2 className="text-4xl">Welcome back, {user?.name}</h2>
            <h1>I am a volunteer</h1>
            <DashboardStats statsData={volunteerStats}></DashboardStats>
        </div>
    );
};

export default VolunteerDashboardHomePage;