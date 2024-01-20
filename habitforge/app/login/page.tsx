"use client";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography-variants";
import { FcGoogle } from "react-icons/fc";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const LoginPage = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const [user, loading, error] = useAuthState(auth);

  const addUserData = async () => {
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  };

  // const [value, loading1, error1] = useCollection(collection(db, "users"));

  // if (!loading1 && value) {
  //   value.docs.map((doc) => {
  //     console.log(doc.data());
  //   });
  // }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-12">
        <Typography variant={"h1"}>Login Page</Typography>
        {user ? (
          <div className="flex flex-col gap-6">
            <Typography variant={"h2"}>Welcome {user.displayName}</Typography>
            <Button onClick={addUserData}>Add User Data</Button>
            <img
              src={user.photoURL ? user.photoURL : ""}
              alt="Abhi Patel"
              className="h-8 w-8 rounded-full"
            />
          </div>
        ) : (
          <Button
            className="flex gap-2"
            size={"lg"}
            variant={"outline"}
            onClick={signInWithGoogle}
          >
            <FcGoogle /> Sign In With Google
          </Button>
        )}
      </div>
    </main>
  );
};

export default LoginPage;
