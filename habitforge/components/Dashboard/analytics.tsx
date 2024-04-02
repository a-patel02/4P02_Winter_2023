"use client";
import React, { useState } from 'react';
import Typography from "@/components/ui/typography-variants";
import CompletionBox from '@/components/ui/completionBox';
import {
    Zap,
    Sparkles,
    Eye,
    TrendingUpIcon,
    Users,
    ArrowRightIcon,
    CheckIcon,
} from "lucide-react";

import Icon from "@/components/ui/Icons";
import GrayBox from '../ui/grayBox';


// Function to calculate percentage completion
const calculatePercentage = (completed: number, total: number): number => {
    return (completed / total) * 100;
};

const habitcolor = "red" //Change color here

const Analytics = () => {

    // Calculate percentage completion
    const percentageCompleted = calculatePercentage(20, 60); //Input habit completed and total done here

    return (
        <main className="">
            {/* Analytics*/}
            <div className="flex flex-col w-full">
                <div className="flex flex-row border-b-2 border-lead w-full">
                    <Typography variant="h4">Analytics</Typography>
                </div>
            </div>
            <div className="flex flex-col">
                {/* GrayBox*/}
                <div className="flex flex-col gap-5 mt-3 flex-grow md:flex-row">
                    <GrayBox title="Total Habits Completed" totalCompleted={10} />
                    <GrayBox title="Total Habits Completed" totalCompleted={10} />
                </div>
                <div className='mt-10'>
                    <Typography variant="p" affects={"lead"} className="!mt-0 text-base">
                        Percent of Habits Completed
                    </Typography>
                </div>
                <div className="flex flex-col gap-5 mt-3 flex-grow md:flex-row">
                    {/* CompletionBox */}
                    <CompletionBox
                        habitName={"Mountain Climing"}
                        icon={<Zap />}
                        color="red"
                        completePercent={percentageCompleted}
                    />

                    <CompletionBox
                        habitName={"Working Out"}
                        icon={<Sparkles />}
                        color="blue"
                        completePercent={percentageCompleted}
                    />
                </div>
            </div>
        </main>
    );
};
export default Analytics;
