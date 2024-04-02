import { FC, useState } from "react";
import Typography from "../ui/typography-variants";
import { Button } from "../ui/button";
import { ArrowLeft, Settings2 } from "lucide-react";
import HabitsDialog from "./HabitsDialog";
import Habits from "../Habits";
import GroupHabitsDialog from "./GroupHabitsDialog";
import Image from "next/image";
interface GroupHabitsProps {
  sortedHabits: any;
  user: any;
}
const GroupHabits: FC<GroupHabitsProps> = ({ sortedHabits, user }) => {
  const [manageHabits, setManageHabits] = useState(false);
  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="flex flex-col w-full">
        <div className="flex w-full flex-col gap-2 md:flex-row md:justify-between py-2 md:items-center">
          <Typography variant={"h4"}>Group Habits</Typography>
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              onClick={() => setManageHabits(!manageHabits)}
            >
              {manageHabits ? <ArrowLeft /> : <Settings2 />}
            </Button>
            <GroupHabitsDialog />
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
              group={true}
              groupId={habit.groupID}
              repeat={habit.repeat}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col w-full gap-2 justify-center items-center">
          <Image src={"GroupHabitsBlue.svg"} height={200} width={200} alt="" />
          <Typography variant={"h4"}>Join or Create a Group Habit</Typography>
          <Typography variant={"p"} affects={"muted"} className="!mt-0">
            Group Habits allow you to complete habits as a group and keep each
            other on track with some friendly competition!
          </Typography>
        </div>
      )}
    </div>
  );
};

export default GroupHabits;
