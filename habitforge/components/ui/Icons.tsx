import React, { ReactNode } from "react";

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

interface Props {
  color?: AllowedColors;
  children: ReactNode;
  colorDirect?: string;
}

const Icon: React.FC<Props> = ({ color, children, colorDirect }) => {
  // Define a map of colors to corresponding CSS classes
  const colorClasses: { [key in AllowedColors]: string } = {
    blue: "bg-blue-100 text-blue-500",
    orange: "bg-orange-100 text-orange-500",
    red: "bg-red-100 text-red-500",
    pink: "bg-pink-100 text-pink-500",
    purple: "bg-purple-100 text-purple-500",
    indigo: "bg-indigo-100 text-indigo-500",
    cyan: "bg-cyan-100 text-cyan-500",
    teal: "bg-teal-100 text-teal-500",
    green: "bg-green-100 text-green-500",
    lime: "bg-lime-100 text-lime-500",
    yellow: "bg-yellow-100 text-yellow-500",
    amber: "bg-amber-100 text-amber-500",
  };

  return (
    <div
      className={`p-3 rounded-full w-fit h-fit ${
        color ? colorClasses[color] : ""
      } bg-${colorDirect}-100 text-${colorDirect}-500`}
    >
      {children}
    </div>
  );
};

export default Icon;
