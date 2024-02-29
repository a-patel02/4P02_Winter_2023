import { FC } from "react";
import HabitsText from "./ui/habitstext";
import { Button } from "./ui/button";

import { Check, ArrowRight, X } from "lucide-react";
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Icon from "./ui/Icons";
import { IconType } from "./IconPicks";

interface HabitsProps {
  habitName: string;
  goal: number;
  streak: number;
  totalSkipped: number;
  totalFailed: number;
  totalCompleted: number;
  completed: boolean;
  skipped: boolean;
  fail: boolean;
  hUID: string;
  uid: string;
  color: string;
  icon: string;
}

const Habits: FC<HabitsProps> = ({
  habitName,
  goal,
  streak,
  totalSkipped,
  totalFailed,
  totalCompleted,
  completed,
  skipped,
  fail,
  hUID,
  uid,
  color,
  icon,
}) => {
  const handleCompleted = async () => {
    await updateDoc(doc(db, "users", uid, "habits", hUID), {
      completed: true,
      totalCompleted: totalCompleted + 1,
      lastCompltedDate: serverTimestamp(),
    });
  };
  const handleSkipped = async () => {
    await updateDoc(doc(db, "users", uid, "habits", hUID), {
      skipped: true,
      totalSkipped: totalSkipped + 1,
    });
  };
  const handleFailed = async () => {
    await updateDoc(doc(db, "users", uid, "habits", hUID), {
      failed: true,
      totalFailed: totalFailed + 1,
    });
  };
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full md:justify-between border-b-2 border-muted py-4">
      <div className="flex flex-col md:flex-row gap-2 md:gap-6">
        <Icon colorDirect={color}> {IconType[icon]} </Icon>
        <HabitsText
          main={true}
          title={habitName}
          description={goal + " /times a day"}
        />
      </div>
      <HabitsText title={"Streak 🔥"} description={streak + " days"} />
      <HabitsText title={"Skipped"} description={totalSkipped + " days"} />
      <HabitsText title={"Failed"} description={totalFailed + " days"} />
      <HabitsText title={"Total"} description={totalCompleted + " done"} />
      <div className="flex gap-4 justify-between">
        <Button
          variant={"success"}
          onClick={handleCompleted}
          className="w-full"
        >
          <Check /> Done
        </Button>
        <Button
          variant={"destructive"}
          onClick={handleFailed}
          className="w-full"
        >
          <X /> Fail
        </Button>
        <Button variant={"ghost"} onClick={handleSkipped} className="w-full">
          <ArrowRight /> Skip
        </Button>
      </div>
    </div>
  );
};

export default Habits;
