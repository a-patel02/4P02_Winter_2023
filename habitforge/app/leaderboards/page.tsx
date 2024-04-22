"use client";
import Podium from "@/components/Leaderboards/Podium";
import Typography from "@/components/ui/typography-variants";
import { auth, db } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import TimeElapsed from "@/components/Leaderboards/TimeElapsed";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboards = () => {
  const [user, loading, error] = useAuthState(auth);
  const [value, loading1, error1] = useCollectionData(
    collection(db, `leaderboards`)
  );
  const sortedValue = value
    ? value.slice().sort((a, b) => b.rank - a.rank)
    : [];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="flex flex-col gap-8 items-center w-full">
        <div className="flex justify-center flex-col gap-2 items-center text-center">
          <Typography variant={"h2"}>Leaderboards</Typography>
          {value ? <TimeElapsed /> : <></>}
        </div>

        {value ? (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex gap-8 w-full flex-col md:flex-row">
              {sortedValue.slice(0, 3).map((doc, index) => (
                <Podium
                  level={index + 1}
                  name={
                    doc.userName == user?.displayName ? "You" : doc.userName
                  }
                  rank={doc.rank}
                  photoURL={doc.photoURL}
                  className={`${
                    index == 0
                      ? "order-1 md:order-2"
                      : index == 1
                      ? "order-2 md:order-1"
                      : index == 2
                      ? "order-3 md:order-3"
                      : ""
                  }`}
                />
              ))}
            </div>
            {sortedValue.length > 3 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Player Name</TableHead>
                    <TableHead className="text-right">Habit Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-bold text-lg ">
                  {sortedValue.slice(3, 11).map((doc, index) => (
                    <TableRow>
                      <TableCell className="font-medium">{index + 4}</TableCell>
                      <TableCell className="flex gap-2 items-center">
                        <img
                          src={doc.photoURL}
                          height={30}
                          width={30}
                          alt="User"
                          className="rounded-full"
                        />
                        {doc.userName == user?.displayName
                          ? "You"
                          : doc.userName}
                      </TableCell>
                      <TableCell className="text-right">{doc.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </div>
    </main>
  );
};

export default Leaderboards;
