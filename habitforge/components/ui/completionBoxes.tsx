import React, { FC } from "react";
import Typography from "./typography-variants";
import Icon from "./Icons";
import CircularProgress from "./circularProg";
import { IconType } from "../IconPicks";

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
  icon: string;
  color: AllowedColors;
  completePercent: number;
}

const CompletionBox: FC<CompletionBoxProps> = ({
  habitName,
  icon,
  color,
  completePercent,
}) => {
  return (
    <div className="flex flex-row items-center justify-between w-full border rounded-lg p-3 gap-3">
      <div className="flex gap-3 items-center">
        <Icon color={color}>{IconType[icon]}</Icon>
        <Typography variant="p" className="!mt-0 text-base font-bold">
          {habitName}
        </Typography>
      </div>
      <CircularProgress percentage={completePercent} pathColor={color} />
    </div>
  );
};

export default CompletionBox;
