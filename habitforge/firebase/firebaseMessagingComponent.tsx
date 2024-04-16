// firebase/firebaseMessagingComponent.tsx
"use client";
import { useEffect } from 'react';
import { generateToken } from '@/firebase/firebase';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/firebase/firebase';

export default function FirebaseMessagingComponent() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);


  return null;
}
