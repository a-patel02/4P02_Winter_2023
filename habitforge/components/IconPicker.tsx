"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconType } from "./IconPicks";

export function IconPicker({
  color,
  icon,
  setColor,
  setIcon,
  className,
}: {
  color: string;
  setColor: (color: string) => void;
  icon: string;
  setIcon: (icon: string) => void;
  className?: string;
}) {
  const solids = [
    "blue",
    "orange",
    "red",
    "pink",
    "purple",
    "indigo",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "amber",
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          type="button"
          size={"icon"}
          className=" w-12 "
        >
          <div className="flex items-center gap-2">
            <div className={`text-${color}-500`}>{IconType[icon]}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue={"icons"} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="icons">
              Icons
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="colors">
              Colors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                className={`rounded-md h-6 w-6 cursor-pointer active:scale-105 bg-${s}-100`}
                onClick={() => setColor(s)}
              />
            ))}
          </TabsContent>

          <TabsContent value="icons" className="flex flex-wrap gap-1 mt-0">
            {Object.keys(IconType).map((iconName) => (
              <Button
                key={iconName}
                variant={"ghost"}
                size={"icon"}
                type="button"
                onClick={() => setIcon(iconName)}
              >
                {IconType[iconName]}
              </Button>
            ))}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
