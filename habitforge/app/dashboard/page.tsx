"use client";
import Typography from "@/components/ui/typography-variants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {showNotification} from './notification';
import React, {useEffect,useCallback} from 'react'

const Dashboard = () => {
  const sendNoticiation = () => {
    if('Notification' in window && Notification.permission === 'granted'){
      new Notification('Hello Developer!' , {
        body: 'this is your notification message!',
        icon: './public/logolight.svg'
      })
    }
  
  };
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window){
      Notification.requestPermission().then(function(permission){
        if (permission === 'granted') {
          console.log('Notification permission granted!')
          sendNoticiation();
        }
      });
    }
   }, []);
   useEffect(() => {
    if ('Notification' in window){
      requestNotificationPermission();
    }
   },[requestNotificationPermission]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col">
        <Typography variant={"h1"}>Dashboard</Typography>

        <div className="flex flex-col gap-4">
          <Typography variant={"h1"}>Please log in</Typography>
          <Link href="/login">
            <Button variant={"outline"}>Log In</Button>
          </Link>
          <button onClick={sendNoticiation}
       className ='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 px-4'>
        Trigger Notification
       </button>
        </div>
      </div>
      
    </main>
  );
};

export default Dashboard;
