"use client";
import React, { useState } from "react";
import Typography from "@/components/ui/typography-variants";
import CompletionBox from "@/components/ui/completionBoxes";
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
import GrayBox from "../ui/greyBox";

// Function to calculate percentage completion
const calculatePercentage = (completed: number, total: number): number => {
  return (completed / total) * 100;
};

const habitcolor = "red"; //Change color here

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
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
        <div className="mt-10">
          <Typography variant="p" affects={"lead"} className="!mt-0 text-base">
            Percent of Habits Completed
          </Typography>
        </div>
        <div className="flex flex-col gap-5 mt-3 flex-grow md:flex-row">
          {/* CompletionBox */}
          <CompletionBox
            habitName={"Mountain Climing"}
            icon={"Sun"}
            color="red"
            completePercent={20}
          />

          <CompletionBox
            habitName={"Working Out"}
            icon={"Dumbbell"}
            color="blue"
            completePercent={20}
          />
        </div>
      </div>
    </div>
  );
};
export default Analytics;
