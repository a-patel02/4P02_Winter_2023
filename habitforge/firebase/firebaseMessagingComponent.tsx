// firebase/firebaseMessagingComponent.tsx
"use client";
import { useEffect } from 'react';
import { generateToken } from '@/firebase/firebase';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/firebase/firebase';

export default function FirebaseMessagingComponent() {
  useEffect(() => {
    if(!messaging){
      console.warn("Firebase Messaging is not supported by your browser")
      return;
    }
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);


  return null;
}
