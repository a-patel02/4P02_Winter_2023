import { FC } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Coins, Lock, Pencil, UserCog } from "lucide-react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase/firebase";
import { collection, doc, updateDoc } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

interface EditProfileProps {
  photoURL: string;
}

const EditProfile: FC<EditProfileProps> = ({ photoURL }) => {
  const [user, loading, error] = useAuthState(auth);
  const [profilePhotos, profilePhotosLoading, profilePhotosError] =
    useCollectionData(collection(db, "profilePhotos"));
  const [firebaseUser, loading2, error2] = useDocumentData(
    doc(db, `users/${user?.uid}`)
  );

  if (profilePhotos && !profilePhotosLoading) {
    profilePhotos.sort((a: any, b: any) => a.coins - b.coins);
  }

  const handlePurchase = async (
    selectedPhotoURL: string,
    selectedPhotoPrice: number
  ) => {
    if (user) {
      if (firebaseUser?.habitCoins >= selectedPhotoPrice) {
        if (firebaseUser?.unlockedPhotos?.includes(selectedPhotoURL)) {
          await updateDoc(doc(db, "users", user.uid), {
            photoURL: selectedPhotoURL,
          });
        } else {
          const unlockedPhotos = firebaseUser?.unlockedPhotos as string[];
          await updateDoc(doc(db, "users", user.uid), {
            unlockedPhotos: [
              ...unlockedPhotos,
              user.photoURL,
              selectedPhotoURL,
            ],
            photoURL: selectedPhotoURL,
            habitCoins: firebaseUser?.habitCoins - selectedPhotoPrice,
          });
        }
      }
    }
  };

  const handleDefault = async () => {
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: user.photoURL,
      });
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="relative">
            <img
              src={photoURL}
              height={70}
              width={70}
              alt=""
              className="rounded-full"
            />
            <div className="absolute inset-0 bg-slate-900 bg-opacity-0 hover:bg-opacity-60 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <UserCog className="text-white" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <div className="flex flex-wrap gap-1 gap-y-2">
            <div className="relative cursor-pointer" onClick={handleDefault}>
              <img
                src={user?.photoURL || ""}
                height={50}
                width={50}
                alt=""
                className="rounded-full"
              />
              <div
                className={`absolute inset-0 text-white bg-slate-900 bg-opacity-0 hover:bg-opacity-60 rounded-full flex items-center gap-1 justify-center transition-opacity duration-300 ${
                  photoURL === user?.photoURL ? "border-2 border-primary" : ""
                }  `}
              ></div>
            </div>
            {profilePhotos?.map((photo: any) => {
              return (
                <div
                  className="relative cursor-pointer"
                  onClick={() => handlePurchase(photo.photoURL, photo.coins)}
                >
                  <img
                    src={photo.photoURL}
                    height={50}
                    width={50}
                    alt=""
                    className="rounded-full"
                  />
                  {firebaseUser?.unlockedPhotos?.includes(photo.photoURL) ? (
                    <div
                      className={`absolute inset-0 text-white bg-slate-900 bg-opacity-0 hover:bg-opacity-60 rounded-full flex items-center gap-1 justify-center transition-opacity duration-300 ${
                        photoURL === photo.photoURL
                          ? "border-2 border-primary"
                          : ""
                      }  `}
                    ></div>
                  ) : (
                    <div className="absolute inset-0 text-white bg-slate-900 bg-opacity-70 hover:bg-opacity-60 rounded-full ">
                      <div className="flex gap-1 p-2 w-full h-full items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Coins className="w-6" /> {photo.coins}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EditProfile;
