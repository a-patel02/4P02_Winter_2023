import Typography from "@/components/ui/typography-variants";
import Image from "next/image";
import HabitsDialog from "../HabitsDialog";
const FirstHabit = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <Typography variant={"h2"}>Create your first habit</Typography>
      <Image src="FirstHabit.svg" alt="Description" width={475} height={284} />
      <div className="flex flex-col items-center text-center gap-2">
        <Typography variant={"h4"}> Start your journey!</Typography>
        <Typography variant={"p"} affects={"muted"} className="!mt-0">
          One habit at a time you can accomplish any goal you set out too!
        </Typography>
      </div>
      <HabitsDialog></HabitsDialog>
    </div>
  );
};

export default FirstHabit;
