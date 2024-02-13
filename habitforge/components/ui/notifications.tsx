"use client";
import { FC } from "react";

import Typography from "./typography-variants";

import { Button } from "./button";

import { CheckIcon, XIcon } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

interface NotificationProps {
  title: string;
  senderUID: string;
  hUID: string;
  groupID: string;
  status?: "pending" | "accepted" | "rejected";
}

const Notification: FC<NotificationProps> = ({
  title,
  senderUID,
  hUID,
  groupID,
  status = "pending", // Default value "pending" if not provided
}) => {
  const [user, loading, error] = useAuthState(auth);

  const handleAccepted = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid, "notifications"), {
        status: "accepted",
      });
    }
  };
  const handleDenied = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid, "notifications"), {
        status: "rejected",
      });
    }
  };
  return status == "pending" ? (
    <div className="p-2 flex ">
      <Typography variant={"p"} affects={"muted"}>
        {title}
      </Typography>
      <div className="flex gap-2">
        <Button variant={"success"} size={"icon"}>
          <CheckIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Notification;
