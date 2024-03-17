"use client";
import { useEffect, useState } from "react";
import Typography from "../ui/typography-variants";

const TimeElapsed = () => {
  const [timeElapsed, setTimeElapsed] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const diffMs = now.getTime() - startOfDay.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    const updateElapsedTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - startOfDay.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffSeconds < 60) {
        setTimeElapsed(
          `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`
        );
      } else {
        const diffMinutes = Math.floor(diffSeconds / 60);

        if (diffMinutes < 60) {
          setTimeElapsed(
            `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
          );
        } else {
          const diffHours = Math.floor(diffMinutes / 60);
          const remainingMinutes = diffMinutes % 60;
          setTimeElapsed(
            `${diffHours} hour${
              diffHours !== 1 ? "s" : ""
            } and ${remainingMinutes} minute${
              remainingMinutes !== 1 ? "s" : ""
            } ago`
          );
        }
      }
    };

    // Initial update
    updateElapsedTime();

    // Update every second
    const intervalId = setInterval(updateElapsedTime, 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Typography variant={"p"} affects={"muted"} className="!mt-0">
      Last Updated: {timeElapsed}
    </Typography>
  );
};

export default TimeElapsed;
