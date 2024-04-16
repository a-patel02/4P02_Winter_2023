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

import { LogOut, MenuIcon, X } from "lucide-react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebase";
import { signOut } from "firebase/auth";

import { Bell } from "lucide-react";

import { collection, doc, getDocs } from "firebase/firestore";

import {
  useCollection,
  useDocument,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

import Notification from "./ui/notifications";
import Typography from "./ui/typography-variants";
import { toast } from "sonner";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const handleLogOut = () => {
    signOut(auth);
  };

  const [value, loading1, error1] = useCollectionData(
    collection(db, `users/${user?.uid}/notifications`)
  );

  const [showed, setShowed] = useState(false);
  if (value?.length) {
    if (!showed && value.length > 0) {
      toast("You have new notifications!");
      setShowed(true);
    }
  }

  const pathName = usePathname();
  return (
    <div className="flex justify-between p-8">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-4 md:gap-12">
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
          {user ? (
            <div className=" hidden md:flex gap-2">
              <Link href="/leaderboards">
                <Button
                  variant={"ghost"}
                  className={` ${
                    pathName === "/leaderboards" ? "text-primary" : ""
                  } `}
                >
                  Leaderboards
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  variant={"ghost"}
                  className={` ${
                    pathName === "/dashboard" ? "text-primary" : ""
                  } `}
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <></>
          )}
          {/* Mobile Navbar */}
          {user ? (
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger>
                  <MenuIcon />
                </SheetTrigger>
                <SheetContent side={"left"}>
                  <SheetHeader>
                    <div className="flex justify-between items-center">
                      <SheetTitle>HabitForge</SheetTitle>
                      {/* <DrawerClose asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <X />
                      </Button>
                    </DrawerClose> */}
                    </div>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link href="/leaderboards">
                        <Button
                          variant={"ghost"}
                          className={`w-full ${
                            pathName === "/leaderboards" ? "text-primary" : ""
                          } `}
                        >
                          Leaderboards
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/dashboard">
                        <Button
                          variant={"ghost"}
                          className={`w-full ${
                            pathName === "/dashboard" ? "text-primary" : ""
                          } `}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                  <SheetFooter>
                    {user && (
                      <Button
                        onClick={handleLogOut}
                        variant={"destructive"}
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Button>
                    )}
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="flex gap-4">
          {loading ? (
            <Skeleton className="h-9 w-9 rounded-md"></Skeleton>
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative">
                    <Button variant="outline" size="icon">
                      <Bell className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                    {(value?.length ?? 0) >= 1 && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {loading1 ? (
                    <Skeleton className="h-4 w-4"></Skeleton>
                  ) : value?.length ?? 0 > 1 ? (
                    value?.map((doc) => (
                      <Notification
                        key={doc.uid}
                        title={doc.title}
                        senderUID={doc.senderUID}
                        hUID={doc.hUID}
                        groupID={doc.groupID}
                        status={doc.status}
                      ></Notification>
                    ))
                  ) : (
                    <div className="p-2 flex justify-center items-center">
                      {" "}
                      <Typography variant={"p"} affects={"muted"}>
                        No new notifications
                      </Typography>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
            </>
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
