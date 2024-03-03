import { FC } from "react";
import HabitsText from "./ui/habitstext";
import { Button } from "./ui/button";

import { Check, ArrowRight, X, Trash } from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Icon from "./ui/Icons";
import { IconType } from "./IconPicks";
import Typography from "./ui/typography-variants";
import { toast } from "sonner";

interface HabitsProps {
  habitName: string;
  goal: number;
  streak: number;
  totalSkipped: number;
  totalFailed: number;
  totalCompleted: number;
  completed: boolean;
  skipped: boolean;
  failed: boolean;
  hUID: string;
  uid: string;
  color: string;
  icon: string;
  tracked: boolean;
  manage: boolean;
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
  failed,
  hUID,
  uid,
  color,
  icon,
  tracked,
  manage,
}) => {
  const handleCompleted = async () => {
    await updateDoc(doc(db, "users", uid, "habits", hUID), {
      completed: true,
      tracked: true,
      totalCompleted: totalCompleted + 1,
      lastCompletedDate: serverTimestamp(),
    });
  };
  const handleSkipped = async () => {
    await updateDoc(doc(db, "users", uid, "habits", hUID), {
      skipped: true,
      tracked: true,
      totalSkipped: totalSkipped + 1,
    });
  };
  const handleFailed = async () => {
    await updateDoc(doc(db, "users", uid, "habits", hUID), {
      failed: true,
      tracked: true,
      totalFailed: totalFailed + 1,
    });
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "users", uid, "habits", hUID));
  };

  const onDelete = () => {
    handleDelete();
    toast.info("Habit Deleted 😢");
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:justify-between border-b-2 border-muted py-4">
      <div className="flex gap-6">
        <Icon colorDirect={color}> {IconType[icon]} </Icon>
        <HabitsText
          main={true}
          title={habitName}
          description={goal + " /times a day"}
        />
      </div>
      <HabitsText title={"Streak 🔥"} description={streak + " day(s)"} />
      <HabitsText title={"Skipped"} description={totalSkipped + " day(s)"} />
      <HabitsText title={"Failed"} description={totalFailed + " day(s)"} />
      <HabitsText
        title={"Completed"}
        description={totalCompleted + " day(s)"}
      />

      {!manage ? (
        !tracked ? (
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
            <Button
              variant={"ghost"}
              onClick={handleSkipped}
              className="w-full"
            >
              <ArrowRight /> Skip
            </Button>
          </div>
        ) : completed ? (
          <div className="flex gap-4 items-center w-[311px] ">
            <div className="flex h-9 w-9 bg-green-600 rounded-md text-white justify-center items-center ">
              <Check />
            </div>
            <Typography variant={"p"} affects={"muted"} className="!mt-0">
              Completed, log again tomorrow
            </Typography>
          </div>
        ) : failed ? (
          <div className="flex gap-4 items-center w-[311px] ">
            <div className="flex h-9 w-9 bg-destructive rounded-md text-white justify-center items-center ">
              <X />
            </div>
            <Typography variant={"p"} affects={"muted"} className="!mt-0">
              Failed, log again tomorrow
            </Typography>
          </div>
        ) : skipped ? (
          <div className="flex gap-4 items-center w-[311px] ">
            <div className="flex h-9 w-9  bg-slate-600 rounded-md text-white justify-center items-center ">
              <ArrowRight />
            </div>
            <Typography variant={"p"} affects={"muted"} className="!mt-0">
              Skipped, log again tomorrow
            </Typography>
          </div>
        ) : (
          <></>
        )
      ) : (
        <div className="w-[311px]">
          <Button variant={"destructive"} onClick={onDelete}>
            <Trash /> Delete Habit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Habits;
