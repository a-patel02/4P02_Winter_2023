import "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(clientCredentials);
const auth = getAuth(app);
const db = getFirestore(app);

export const messaging = getMessaging(app);
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BMmOSKYwe4lOgqvySO20jpnvsKIR9igPKfylpVG-IElVpqibZE-syt22hlakB3Y0Krur4ethF8G0vD6zzfVIMRc",
    });
    console.log(token);
  }
};

export { app, auth, db};
