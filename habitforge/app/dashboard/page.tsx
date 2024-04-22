"use client";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Typography from "@/components/ui/typography-variants";

import { Coins, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import FirstHabit from "@/components/Dashboard/FirstHabit";
import PersonalHabits from "@/components/Dashboard/PersonalHabits";
import GroupHabits from "@/components/Dashboard/GroupHabits";
import Analytics from "@/components/Dashboard/analyticsSec";
import Image from "next/image";
import Mute from "@/components/ui/mute";
import EditProfile from "@/components/Dashboard/EditProfile";

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

  const individualHabits = value?.filter((habit) => !habit.groupID);
  const groupHabits = value?.filter((habit) => habit.groupID);

  // Sorting the habits based on timestamp from oldest to newest
  const sortedIndvidualHabits = individualHabits?.slice().sort((a, b) => {
    return a.timestamp - b.timestamp;
  });

  const sortedGroupHabits = groupHabits?.slice().sort((a, b) => {
    return a.timestamp - b.timestamp;
  });

  useEffect(() => {
    // Check if user is not logged in and redirect if needed
    if (!loading && !user) {
      window.location.href = "/login"; // Redirect to login page
    }
  }, [loading, user]);

  const [level, setLevel] = useState(1);

  const returnLevel = (habitScore: number) => {
    if (habitScore >= 0 && habitScore < 10) {
      setLevel(1);
    } else if (habitScore >= 10 && habitScore < 20) {
      setLevel(2);
    } else if (habitScore >= 20 && habitScore < 30) {
      setLevel(3);
    } else if (habitScore >= 30 && habitScore < 40) {
      setLevel(4);
    } else if (habitScore >= 40) {
      setLevel(5);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      returnLevel(firebaseUser.habitScore);
      updateLevel();
    }
    console.log("updated level");
  });

  const updateLevel = async () => {
    await updateDoc(doc(db, "users", user?.uid || ""), {
      level: level,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <Mute />
      {loading1 ? (
        // <Skeleton className="w-full h-4"></Skeleton>
        <Loader2 className="animate-spin" />
      ) : (
        <div className="flex flex-col gap-12 w-full">
          {value?.length === 0 ? (
            <FirstHabit />
          ) : (
            <>
              <div className="flex gap-4 flex-col items-start md:items-center text-left md:flex-row w-full">
                {firebaseUser?.photoURL && (
                  <EditProfile photoURL={firebaseUser.photoURL} />
                )}
                <div className="flex flex-col gap-2 w-full">
                  <Typography variant={"h2"}>
                    {getGreeting()}, {user?.displayName}
                  </Typography>
                  <Typography variant={"p"} affects={"muted"} className="!mt-0">
                    You are currently at Level {level},{" "}
                    {level != 5
                      ? "level up by completing habits and earning HabitCoins."
                      : "Max level reached, keep up the good work!"}
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
              <PersonalHabits
                sortedHabits={sortedIndvidualHabits}
                user={firebaseUser}
              />
              <GroupHabits
                sortedHabits={sortedGroupHabits}
                user={firebaseUser}
              />
              <Analytics user={firebaseUser} habits={value} />
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
