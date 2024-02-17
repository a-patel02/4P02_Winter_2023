"use client";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography-variants";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const LoginPage = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider();

    signInWithPopup(auth, provider);
  };

  const [user, loading, error] = useAuthState(auth);

  // const addUserData = async () => {
  //   if (user) {
  //     await setDoc(doc(db, "users", user.uid), {
  //       name: user.displayName,
  //       email: user.email,
  //       photoURL: user.photoURL,
  //     });
  //   }
  // };

  // const [value, loading1, error1] = useCollection(collection(db, "users"));

  // if (!loading1 && value) {
  //   value.docs.map((doc) => {
  //     console.log(doc.data());
  //   });
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24  ">
      <div className="box-content h-auto w-auto p-10 border-2">
        <div className="flex flex-col gap-8 items-center">
          <img
            src="/logoDark.svg"
            alt=""
            className="dark:hidden mr-3 h-10  block w-auto"
          />
          <img
            src="/logoLight.svg"
            alt=""
            className="hidden dark:block mr-3 h-8 w-auto"
          />
          <Typography variant={"h5"}>Welcome to Habit Forge</Typography>
          <Typography variant={"h6"}>
            Sign in to your account and start forging habits .
          </Typography>

          {user ? (
            <div className="flex flex-col gap-6">
              <Typography variant={"h2"}>Welcome {user.displayName}</Typography>
              <img
                src={user.photoURL ? user.photoURL : ""}
                alt="Abhi Patel"
                className="h-8 w-8 rounded-full"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <Button
                className="flex gap-2 "
                size={"lg"}
                variant={"outline"}
                onClick={signInWithGoogle}
              >
                <FcGoogle /> Sign In With Google
              </Button>
              <Button
                className="flex gap-2 "
                size={"lg"}
                variant={"outline"}
                onClick={signInWithGitHub}
              >
                <AiFillGithub /> Sign In With GitHub
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
