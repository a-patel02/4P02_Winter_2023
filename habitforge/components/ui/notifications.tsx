"use client";
import { FC } from "react";

import Typography from "./typography-variants";

import { Button } from "./button";

import { CheckIcon, XIcon } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";

interface NotificationProps {
  title: string;
  senderUID: string;
  hUID: string;
  groupID: string;
  status?: string;
  edit?: boolean;
}

const Notification: FC<NotificationProps> = ({
  title,
  senderUID,
  hUID,
  groupID,
  status, // Default value "pending" if not provided
  edit,
}) => {
  const [user, loading, error] = useAuthState(auth);

  const [createdHabit, loading3, error3] = useDocument(
    doc(db, `users/${senderUID}/habits/${hUID}`)
  );

  const handleAccepted = async () => {
    if (user) {
      await deleteDoc(doc(db, "users", user.uid, "notifications", groupID));

      await updateDoc(doc(db, `groups/${groupID}/members/${user?.uid}`), {
        status: "accepted",
      });

      if (createdHabit && !loading3 && createdHabit.data()) {
        if (!edit || status === "pending") {
          await setDoc(doc(db, "users", user.uid, "habits", hUID), {
            timestamp: serverTimestamp(),
            habitName: createdHabit.data()?.habitName,
            goal: createdHabit.data()?.goal,
            repeat: createdHabit.data()?.repeat,
            startDate: createdHabit.data()?.startDate,
            tracked: false,
            completed: false,
            skipped: false,
            failed: false,
            totalCompleted: 0,
            totalSkipped: 0,
            totalFailed: 0,
            streak: 0,
            lastCompletedDate: "",
            hUID: createdHabit.data()?.hUID,
            icon: createdHabit.data()?.icon,
            color: createdHabit.data()?.color,
            groupID: createdHabit.data()?.groupID,
          });
        } else {
          await updateDoc(doc(db, "users", user.uid, "habits", hUID), {
            habitName: createdHabit.data()?.habitName,
            goal: createdHabit.data()?.goal,
            repeat: createdHabit.data()?.repeat,
            icon: createdHabit.data()?.icon,
            color: createdHabit.data()?.color,
          });
        }
      }
    }
  };
  const handleDenied = async () => {
    if (user) {
      await deleteDoc(doc(db, "users", user.uid, "notifications", groupID));
    }
  };
  return (
    <div className="p-2 flex items-center bg-slate-100 rounded-sm ">
      <Typography variant={"p"} className="!mt-0 leading-4" affects={"small"}>
        {title}
      </Typography>
      <div className="flex gap-2">
        <Button variant={"success"} size={"icon"} onClick={handleAccepted}>
          <CheckIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <Button variant={"destructive"} size={"icon"} onClick={handleDenied}>
          <XIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </div>
  );
};

export default Notification;
