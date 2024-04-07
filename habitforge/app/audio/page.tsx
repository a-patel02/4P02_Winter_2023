"use client";
import React, { useState } from "react";

export default function Home() {
  const [muted, setMuted] = useState(false);

  const playSound = () => {
    if (muted) {
      alert("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("level-up.wav").play();
    }
  };
  const playSound2 = () => {
    if (muted) {
      alert("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("error.mp3").play();
    }
  };

  const playSound3 = () => {
    if (muted) {
      alert("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("skipped.mp3").play();
    }
  };

  const playSound4 = () => {
    if (muted) {
      alert("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("success.mp3").play();
    }
  };

  const playSound5 = () => {
    if (muted) {
      alert("The page is muted. Please unmute to play sounds.");
    } else {
      new Audio("complete.mp3").play();
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (muted) {
      alert("Page unmuted.");
    } else {
      alert("Page muted.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-bold">One Button Page</h1>
        <button
          className="text-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={playSound}
        >
          Level Up
        </button>

        <button
          className="text-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={playSound4}
        >
          Success
        </button>

        <button
          className="text-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={playSound3}
        >
          Skipped
        </button>

        <button
          className="text-md bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={playSound5}
        >
          Completed
        </button>

        <button
          className="text-md bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={playSound2}
        >
          Error
        </button>
        
        <button
          className="text-md bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleMute}
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </main>
  );
}

