import React, { FC } from "react";
import Typography from "./typography-variants";

interface AnalyticsBoxProps {
  title: string;
  number: string;
}

const AnalyticsBox: FC<AnalyticsBoxProps> = ({ title, number }) => {
  return (
    <div className="flex flex-col bg-slate-100 rounded-lg w-full p-3 gap-3">
      <Typography variant="p" affects="muted" className="!mt-0">
        {title}
      </Typography>
      <Typography variant="h3" className="!mt-0">
        {number}
      </Typography>
    </div>
  );
};

export default AnalyticsBox;
