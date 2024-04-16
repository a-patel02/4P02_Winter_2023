"use client";
import { useMute } from "../Dashboard/MuteProvider";
import { VolumeX, Volume2 } from "lucide-react";

const Mute = () => {
  const { muted, setMuted } = useMute();

  const toggleMute = () => {
    setMuted(!muted);
  };
  return (
    <div
      className="p-4 rounded-full bg-slate-900 shadow-xl flex justify-center items-center fixed bottom-10 right-10 cursor-pointer"
      onClick={toggleMute}
    >
      {muted ? (
        <VolumeX className=" text-red-600" />
      ) : (
        <Volume2 className=" text-white" />
      )}
    </div>
  );
};

export default Mute;
