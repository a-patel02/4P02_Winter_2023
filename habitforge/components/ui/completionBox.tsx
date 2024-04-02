import React, { FC } from "react";
import Typography from "./typography-variants";
import Icon from "./Icons";
import 'react-circular-progressbar/dist/styles.css';
import CircularProgress from "./circularProgress";

type AllowedColors =
  | "blue"
  | "orange"
  | "red"
  | "pink"
  | "purple"
  | "indigo"
  | "cyan"
  | "teal"
  | "green"
  | "lime"
  | "yellow"
  | "amber";

interface CompletionBoxProps {
  habitName: string;
  icon: JSX.Element;
  color: AllowedColors;
  completePercent: number;
}

const CompletionBox: FC<CompletionBoxProps> = ({ habitName, icon, color, completePercent }) => {
  return (
    <div className="flex flex-row items-center justify-center border rounded-lg p-2 gap-3">
      <Icon color={color} >
        {icon}
      </Icon>
      <Typography variant="p" className="!mt-0 text-base font-bold">
        {habitName}
      </Typography>

      <CircularProgress
        percentage={completePercent}
        pathColor={color}
      />
    </div>
  );
};

export default CompletionBox;