import React, { FC } from "react";
import Typography from "./typography-variants";

interface GrayBoxProps {
  title: string;
  totalCompleted: number;
}

const GrayBox: FC<GrayBoxProps> = ({ title, totalCompleted }) => {
  return (
    <div className="flex flex-col bg-slate-100 rounded-lg p-3 gap-3">
      <Typography variant="p" affects="muted" className="!mt-0">
        {title}
      </Typography>
      <Typography variant="h3" className="!mt-0">
        {totalCompleted}
      </Typography>
    </div>
  );
};

export default GrayBox;
