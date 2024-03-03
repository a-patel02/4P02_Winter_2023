"use client";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { Button } from "./ui/button";
const Footer = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div className="flex justify-between p-12 md:p-24">
      <div className="flex justify-between w-full items-center">
        <Link href={"/"}>
          <div className="flex items-center">
            <img
              src="/logoDark.svg"
              alt=""
              className="dark:hidden mr-3 h-8  block w-auto"
            />
            <img
              src="/logoLight.svg"
              alt=""
              className="hidden dark:block mr-3 h-8 w-auto"
            />
            <h4 className="text-lg font-bold hidden sm:block">HabitForge</h4>
          </div>
        </Link>
        <div className="flex gap-2">
          <Link href={"/leaderboards"}>
            <Button variant={"ghost"}>Leaderboards</Button>
          </Link>
          {user && (
            <Link href={"/dashboard"}>
              <Button variant={"ghost"}>Dashboard</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
