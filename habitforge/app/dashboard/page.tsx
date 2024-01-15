"use client";
import Typography from "@/components/ui/typography-variants";
import { UserAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const Dashboard = () => {
  const { user } = UserAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col">
        {user ? (
          <Typography variant={"h1"}>Dashboard</Typography>
        ) : (
          <div className="flex flex-col gap-4">
            <Typography variant={"h1"}>Please log in</Typography>
            <Link href="/login">
              <Button variant={"outline"}>Log In</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
