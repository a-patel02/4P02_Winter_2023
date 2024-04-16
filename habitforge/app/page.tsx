"use client";
import Image from "next/image";
import Typography from "@/components/ui/typography-variants";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Sparkles,
  Eye,
  TrendingUpIcon,
  Users,
  ArrowRightIcon,
  CheckIcon,
} from "lucide-react";

import Icon from "@/components/ui/Icons";

import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="flex flex-col items-center gap-72 w-full">
        {/* Hero Section */}
        <div className="flex flex-col gap-12 md:gap-24">
          <div className="flex flex-col items-center gap-8">
            {/* Blue */}
            <div className="px-3 py-3 bg-secondary rounded-full text-primary text-center">
              <Typography variant="p" affects={"small"}>
                We first make our habits, then our habits make us.
              </Typography>
            </div>
            {/* Text */}
            <div className="flex flex-col items-center text-center gap-8">
              <Typography variant="h1">
                Forge a better life one habit at a time.
              </Typography>
              <Typography variant="p" affects={"lead"} className="!mt-0">
                Start your journey of accomplishing any challenge by tracking
                your habits with HabitForge
              </Typography>
              <Link href={user ? "/dashboard" : "/login"}>
                <Button size={"lg"} className="text-md">
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                  <ArrowRightIcon />
                </Button>
              </Link>
            </div>
          </div>

          {/* Demo Section */}
          <div className="centered-section flex flex-col items-center">
            <Image
              src="HeroImage.svg"
              alt="Description"
              width={1280}
              height={600}
              className="hidden md:inline-block"
            />
            <Image
              src="HeroImageMobile.svg"
              alt="Description"
              width={1280}
              height={600}
              className="inline-block md:hidden"
            />
          </div>
        </div>

        {/* 3 Icons */}
        <div className="flex justify-center flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <Icon color="blue">
              <Zap />
            </Icon>
            <Typography variant="h4">
              Stay motivated to complete your habits
            </Typography>
            <Typography variant="p" affects={"lead"} className="!mt-0">
              Stay motivated to complete your habits by earning rewards at every
              completion.
            </Typography>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Icon color="amber">
              <Sparkles />
            </Icon>
            <Typography variant="h4">Aim for the stars</Typography>
            <Typography variant="p" affects={"lead"} className="!mt-0">
              Challenge yourself to achieve even the hardest goal, and we
              promise to keep you motivated.
            </Typography>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Icon color="purple">
              <Eye />
            </Icon>
            <Typography variant="h4">View your progress</Typography>
            <Typography variant="p" affects={"lead"} className="!mt-0">
              With the help of our daily logs and graphs, you can visualize your
              journey.
            </Typography>
          </div>
        </div>

        {/* Leaderboard Section */}

        <div className="flex items-center flex-col md:flex-row gap-14 justify-center">
          <div className="order-2 md:order-1">
            <Image
              src="Leaderboard.svg"
              alt="Person Pointing"
              width={500}
              height={32}
            />
          </div>

          <div className="flex flex-col gap-4 order-1 md:order-2 items-center text-center md:text-left md:items-start">
            <Icon color="orange">
              <TrendingUpIcon />
            </Icon>
            <Typography variant="h2">Get on the leaderboard</Typography>
            <Typography variant="p" affects={"lead"} className="!mt-0">
              Complete your habits and keep your streak going to improve your
              rank and try to beat the global leaderboards.
            </Typography>

            <div className="flex gap-2">
              <CheckIcon /> Create habits
            </div>
            <div className="flex gap-2">
              <CheckIcon /> Keep your streak going
            </div>
            <div className="flex gap-2">
              <CheckIcon /> Become the #1 ranked HabitForger
            </div>
          </div>
        </div>

        {/* Challenges */}

        <div className="flex items-center flex-col md:flex-row gap-14 justify-center">
          <div className="order-2">
            <Image
              src="GroupChallenges.svg"
              alt="Group of people together"
              width={500}
              height={32}
            />
          </div>

          <div className="flex flex-col gap-4 order-1 items-center text-center md:text-left md:items-start">
            <Icon color="green">
              <Users />
            </Icon>
            <Typography variant="h2">
              Create group <span className="text-green-600 ">challenges</span>
            </Typography>
            <Typography variant="p" affects={"lead"} className="!mt-0">
              Invite your friends to complete habits set as a group. Hold each
              other accountable and add some fun to habit forming.
            </Typography>

            <div className="flex gap-2">
              <CheckIcon /> Challenge your friends
            </div>
            <div className="flex gap-2">
              <CheckIcon /> Make habit forming engaging
            </div>
            <div className="flex gap-2">
              <CheckIcon /> Reach the top rank in your group
            </div>
          </div>
        </div>

        {/* Call to action section */}
        <div className="flex flex-col items-center gap-8 text-center">
          <Typography variant="h1">HabitForge is free forever</Typography>
          <Typography variant="p" affects={"lead"} className="!mt-0">
            HabitForge is completely free for habit formers like you!{" "}
          </Typography>
          <Link href={user ? "/dashboard" : "/login"}>
            <Button size={"lg"} className="text-md">
              {user ? "Go to Dashboard" : "Get Started for Free"}
              <ArrowRightIcon />
            </Button>
          </Link>
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-2">
              <CheckIcon /> All features free
            </div>
            <div className="flex gap-2">
              <CheckIcon /> Create unlimited habits
            </div>
            <div className="flex gap-2">
              <CheckIcon /> Access all your analytics
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
