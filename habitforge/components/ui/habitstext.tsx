import { FC } from "react";
import Typography from "./typography-variants";

interface HabitsTextProps {
  title: string;
  description: string;
  main?: boolean;
}

const HabitsText: FC<HabitsTextProps> = ({ title, description, main }) => {
  return (
    <div className={`flex flex-col  ${main ? "" : "ml-[72px] md:m-0"}`}>
      <Typography variant={"p"} affects={"removePMargin"} className="text-lg">
        {title}
      </Typography>
      <Typography
        variant={"p"}
        affects={"muted"}
        className="!mt-0 text-muted-foreground"
      >
        {description}
      </Typography>
    </div>
  );
};

export default HabitsText;
