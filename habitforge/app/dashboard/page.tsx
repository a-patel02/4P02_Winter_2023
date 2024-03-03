"use client";
import { collection, doc, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import {
  useCollection,
  useDocument,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Typography from "@/components/ui/typography-variants";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

import HabitsDialog from "@/components/HabitsDialog";

import { ArrowLeft, Coins, Settings2 } from "lucide-react";
import Habits from "@/components/Habits";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import FirstHabit from "@/components/Dashboard/FirstHabit";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [user, loading, error] = useAuthState(auth);
  const [value, loading1, error1] = useCollectionData(
    collection(db, `users/${user?.uid}/habits`)
  );
  const [firebaseUser, loading2, error2] = useDocumentData(
    doc(db, `users/${user?.uid}`)
  );

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 19) {
      return "Good Afternoon";
    } else {
      return "Good Night";
    }
  }

  // Sorting the habits based on timestamp from oldest to newest
  const sortedHabits = value?.slice().sort((a, b) => {
    return a.timestamp - b.timestamp;
  });

  useEffect(() => {
    // Check if user is not logged in and redirect if needed
    if (!loading && !user) {
      window.location.href = "/login"; // Redirect to login page
    }
  }, [loading, user]);

  const [manageHabits, setManageHabits] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      {loading1 ? (
        // <Skeleton className="w-full h-4"></Skeleton>
        <Loader2 className="animate-spin" />
      ) : (
        <div className="flex flex-col gap-12 w-full">
          {value?.length === 0 ? (
            <FirstHabit />
          ) : (
            <>
              <div className="flex gap-4 flex-col items-center text-center md:flex-row md:text-left w-full">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    height={70}
                    width={70}
                    alt=""
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <Typography variant={"h2"}>
                    {getGreeting()}, {user?.displayName}
                  </Typography>
                  <Typography variant={"p"} affects={"muted"} className="!mt-0">
                    You are currently at Level {firebaseUser?.level}, level up
                    by completing habits and earning HabitCoins.
                  </Typography>
                </div>
                <div className="flex flex-row md:flex-col items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <Typography variant={"h2"}>
                      {firebaseUser?.habitCoins}
                    </Typography>
                    <Coins className="text-amber-500 " />
                  </div>
                  <Typography variant={"p"} affects={"muted"} className="!mt-0">
                    HabitCoins
                  </Typography>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex w-full flex-col gap-2 md:flex-row md:justify-between py-2 md:items-center">
                  <Typography variant={"h4"}>All Habits</Typography>
                  <div className="flex gap-2">
                    <Button
                      variant={"outline"}
                      onClick={() => setManageHabits(!manageHabits)}
                    >
                      {manageHabits ? <ArrowLeft /> : <Settings2 />}
                    </Button>
                    <HabitsDialog></HabitsDialog>
                  </div>
                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-4 w-full">
                {sortedHabits?.map((habit: any) => (
                  <Habits
                    uid={user?.uid ? user.uid : ""}
                    habitName={habit.habitName}
                    goal={habit.goal}
                    streak={habit.streak}
                    totalCompleted={habit.totalCompleted}
                    totalFailed={habit.totalFailed}
                    totalSkipped={habit.totalSkipped}
                    completed={habit.completed}
                    skipped={habit.skipped}
                    failed={habit.failed}
                    hUID={habit.hUID}
                    color={habit.color}
                    icon={habit.icon}
                    tracked={habit.tracked}
                    manage={manageHabits}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
