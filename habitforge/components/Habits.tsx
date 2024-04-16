import { FC } from "react";
import HabitsText from "./ui/habitstext";
import { Button } from "./ui/button";

import { Check, ArrowRight, X, Trash, Group } from "lucide-react";
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
import { useCollectionData } from "react-firebase-hooks/firestore";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import GroupHabitsDialog from "./Dashboard/GroupHabitsDialog";

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
  setManage: (value: boolean) => void;
  group?: boolean;
  groupId?: string;
  repeat: string;
  muted: boolean;
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
  setManage,
  groupId,
  group,
  repeat,
  muted,
}) => {
  const [value, loading, error] = useCollectionData(
    collection(db, `groups/${groupId}/members`)
  );

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
    console.log("group: ", group, "groupId: ", groupId);
    if (group && groupId) {
      console.log("trying to delete");
      await deleteDoc(doc(db, "groups", groupId, "members", uid));
      console.log("deleted");
    }
  };

  const onDelete = () => {
    handleDelete();
    setManage(false);
    toast.info("Habit Deleted 😢");
  };
  const failedSound = () => {
    if (muted) {
      toast("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("error.mp3").play();
    }
  };

  const skippedSound = () => {
    if (muted) {
      toast("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("skipped.mp3").play();
    }
  };

  const successSound = () => {
    if (muted) {
      toast("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("success.mp3").play();
    }
  };

  const completedSound = () => {
    if (muted) {
      toast("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("complete.mp3").play();
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b-2 border-muted py-4">
      <div className="flex flex-col md:flex-row gap-4 w-full md:justify-between ">
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
                onClick={() => {
                  handleCompleted();
                  completedSound();
                }}
                className="w-full"
              >
                <Check /> Done
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  handleFailed();
                  failedSound();
                }}
                className="w-full"
              >
                <X /> Fail
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => {
                  handleSkipped();
                  skippedSound();
                }}
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
          <div className="w-[311px] flex gap-4">
            {group ? (
              <GroupHabitsDialog
                habitName={habitName}
                goal={goal}
                repeat={
                  repeat == "daily"
                    ? "daily"
                    : repeat == "weekly"
                    ? "weekly"
                    : "monthly"
                }
                hUID={hUID}
                color={color}
                icon={icon}
                edit={true}
                groupEmails={value?.map((member: any) => member.email) ?? []}
                groupID={groupId}
              />
            ) : (
              <></>
            )}

            <Button variant={"destructive"} onClick={onDelete}>
              <Trash /> Delete Habit
            </Button>
          </div>
        )}
      </div>
      {group && (
        <div className="flex gap-2">
          {value?.map(
            (member: any) =>
              member.status === "accepted" && (
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <Avatar>
                        <AvatarImage src={member.photoURL} />
                        <AvatarFallback>
                          {member.displayName.toString().slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{member.displayName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Habits;
