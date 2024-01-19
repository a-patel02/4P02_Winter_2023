"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { LogOut } from "lucide-react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const handleLogOut = () => {
    signOut(auth);
  };
  return (
    <div className="flex justify-between p-8">
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
        {/* <Link href={"/"}>
          <Button variant={"link"}>Home</Button>
        </Link> */}
        <div className="flex gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{user.displayName}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/login"}>
              <Button>Log in</Button>
            </Link>
          )}
          <ModeToggle></ModeToggle>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
