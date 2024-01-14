"use client";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography-variants";
import { UserAuth } from "@/app/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useEffect } from "react";

const LoginPage = () => {
  const { user, signInWithGoogle } = UserAuth();

  async function addDocToCollection() {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      await addDocToCollection();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-12">
        <Typography variant={"h1"}>Login Page</Typography>
        {user ? (
          <div className="flex flex-col gap-6">
            <Typography variant={"h2"}>Welcome {user.displayName}</Typography>
          </div>
        ) : (
          <Button
            className="flex gap-2"
            size={"lg"}
            variant={"outline"}
            onClick={handleSignIn}
          >
            <FcGoogle /> Sign In With Google
          </Button>
        )}
      </div>
    </main>
  );
};

export default LoginPage;
