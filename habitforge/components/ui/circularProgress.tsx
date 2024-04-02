import React from 'react';

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

interface CircularProgressProps {
  percentage: number;
  pathColor?: string;
  textColor?: string;
}

const circularProgress: React.FC<CircularProgressProps> = ({ percentage, pathColor, textColor }) => {

  const colorClass: { [key: string]: string } = {
    blue: "stroke-blue-500",
    orange: "stroke-orange-500",
    red: "stroke-red-500",
    pink: "stroke-pink-500",
    purple: "stroke-purple-500",
    indigo: "stroke-indigo-500",
    cyan: "stroke-cyan-500",
    teal: "stroke-teal-500",
    green: "stroke-green-500",
    lime: "stroke-lime-500",
    yellow: "stroke-yellow-500",
    amber: "stroke-amber-500",
  };

  const bgcolorClass: { [key: string]: string } = {
    blue: "stroke-blue-100",
    orange: "stroke-orange-100",
    red: "stroke-red-100",
    pink: "stroke-pink-100",
    purple: "stroke-purple-100",
    indigo: "stroke-indigo-100",
    cyan: "stroke-cyan-100",
    teal: "stroke-teal-100",
    green: "stroke-green-100",
    lime: "stroke-lime-100",
    yellow: "stroke-yellow-100",
    amber: "stroke-amber-100",
  };


  const strokeWidth = 8
  const size = 65; // Default size
  const radius = size / 2 - strokeWidth;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = Math.round(circumference - (percentage / 100) * circumference);
  const rotation = 270; // Set rotation to 90 degrees

  const strokeColorClass = pathColor ? colorClass[pathColor] || '' : '';
  const bgStrokecolorClass = pathColor ? bgcolorClass[pathColor] || '' : '';

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        height={size}
        width={size}
        viewBox={`0 0 ${size} ${size}`}
        className="circular-progress"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <circle
          className={`background-progress-bar ${bgStrokecolorClass}`}
          stroke="#f3f4f6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`progress-bar ${strokeColorClass}`}
          stroke={pathColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Reverse rotation for text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          stroke={textColor}
          strokeWidth="0.5px"
          dy=".3em"
          transform={`rotate(-${rotation} ${size / 2} ${size / 2})`}
          style={{ fontSize: `${size * 0.2}px` }}
        >
          {Math.round(percentage)}%
        </text>
      </svg>
    </div>
  );
};

export default circularProgress;
