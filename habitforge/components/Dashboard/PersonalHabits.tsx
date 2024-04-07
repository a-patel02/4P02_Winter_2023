import Typography from "@/components/ui/typography-variants";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

import HabitsDialog from "@/components/Dashboard/HabitsDialog";

import { ArrowLeft, Coins, Settings2 } from "lucide-react";
import Habits from "@/components/Habits";

import FirstHabit from "@/components/Dashboard/FirstHabit";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";

interface PersonalHabitsProps {
  sortedHabits: any;
  user: any;
  muted: boolean;
}
const PersonalHabits: FC<PersonalHabitsProps> = ({
  sortedHabits,
  user,
  muted,
}) => {
  const [manageHabits, setManageHabits] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
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
      {sortedHabits?.length > 0 ? (
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
              setManage={setManageHabits}
              key={habit.hUID}
              repeat={habit.repeat}
              muted={muted}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center">
          <Image
            src="FirstHabit.svg"
            alt="Description"
            width={200}
            height={200}
          />
          <Typography variant={"h4"}>Create a personal habit</Typography>
          <Typography variant={"p"} affects={"muted"} className="!mt-0">
            One habit at a time you can accomplish any goal you set out too!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default PersonalHabits;
