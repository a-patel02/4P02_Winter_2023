"use client";
import React, { FC, use, useState } from "react";
import Typography from "@/components/ui/typography-variants";
import CompletionBox from "@/components/ui/completionBoxes";

import Icon from "@/components/ui/Icons";
import { Timestamp } from "firebase/firestore";
import AnalyticsBox from "../ui/analyticsBox";
import Image from "next/image";

interface AnalyticsProps {
  habits: any;
  user: any;
}

const Analytics: FC<AnalyticsProps> = ({ habits, user }) => {
  // Step 2: Filter Habits by Date (Last 7 days)
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const habitsLastWeek = habits.filter((habit: any) => {
    let habitLastCompletedDate;
    if (habit.lastCompletedDate instanceof Timestamp) {
      habitLastCompletedDate = habit.lastCompletedDate.toDate();
    } else {
    }
    return (
      habitLastCompletedDate >= lastWeek && habitLastCompletedDate <= today
    );
  });

  // Step 3: Calculate Total Habits Completed
  const totalCompleted = habitsLastWeek.reduce(
    (total: any, habit: any) => total + (habit.completed ? 1 : 0),
    0
  );

  // Step 4: Calculate Last 7 Days Progress
  const totalHabitsLastWeek = habitsLastWeek.length;
  const last7DaysProgress =
    totalHabitsLastWeek > 0
      ? ((totalCompleted / totalHabitsLastWeek) * 100).toFixed(0)
      : 0;

  // Step 5: Calculate Habit Completion Rate
  const totalHabits = habits.length;
  const habitCompletionRate = ((totalCompleted / totalHabits) * 100).toFixed(0);

  // Step 6: Calculate Longest Streak
  let longestStreak = 0;
  let currentStreak = 0;

  habits.forEach((habit: any) => {
    if (habit.completed) {
      const habitLastCompletedDate = new Date(habit.lastCompletedDate);
      const diffTime = Math.abs(
        today.getTime() - habitLastCompletedDate.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
    }
  });

  // Check streak if it continued to today
  longestStreak = Math.max(longestStreak, currentStreak);

  console.log("Total habits completed in the last 7 days:", totalCompleted);
  console.log("Last 7 days progress (percentage):", last7DaysProgress);
  console.log("Habit completion rate (percentage):", habitCompletionRate);
  console.log("Longest streak:", longestStreak);
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Analytics*/}
      <div className="flex flex-col w-full">
        <div className="flex flex-row border-b-2 border-lead w-full pb-3">
          <Typography variant="h4">Analytics</Typography>
        </div>
      </div>
      {1 > 0 ? (
        <div className="flex flex-col">
          {/* GrayBox*/}
          <div className="flex flex-col gap-5 mt-3 flex-grow md:flex-row">
            <AnalyticsBox
              title="Total Habits Completed"
              number={totalCompleted}
            />
            <AnalyticsBox
              title="Weekly Progress"
              number={last7DaysProgress.toString() + "%"}
            />
            <AnalyticsBox
              title="Habit Completion Rate"
              number={habitCompletionRate.toString() + "%"}
            />
            <AnalyticsBox
              title="Longest Streak"
              number={longestStreak.toString() + " days 🔥"}
            />
          </div>
          <div className="mt-10">
            <Typography
              variant="p"
              affects={"lead"}
              className="!mt-0 text-base"
            >
              Percent of Habits Completed
            </Typography>
          </div>
          <div className="flex flex-col gap-5 mt-3 flex-grow md:flex-row">
            {/* CompletionBox */}
            {habits?.map((habit: any) => (
              <CompletionBox
                habitName={habit.habitName}
                icon={habit.icon}
                color={habit.color}
                completePercent={
                  (habit.totalCompletedWeekly / (habit.goal * 7)) * 100
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-6 items-center p-3 bg-slate-100 rounded-lg">
          <Image src={"AnalyticsEmpty.svg"} height={60} width={60} alt="" />
          <div className="flex flex-col gap-2">
            <Typography variant={"h4"}>
              Track habits for 7 days to see your analytics
            </Typography>
            <Typography variant={"p"} affects={"muted"} className="!mt-0">
              Continue making and tracking habits and come back after 7 days to
              see your analytics
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};
export default Analytics;
