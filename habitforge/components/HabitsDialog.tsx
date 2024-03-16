import {
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import useSpeechRecognition from "./useSpeechRecognitionHook";
import { Button } from "./ui/button";
import React, { useEffect } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

import {
  CalendarIcon,
  Check,
  Keyboard,
  Mic,
  Plus,
  RotateCcw,
} from "lucide-react";

import { Input } from "./ui/input";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { toast } from "sonner";
import { IconPicker } from "./IconPicker";
import { useState } from "react";
import Typography from "./ui/typography-variants";
import Edit from "./Edit";
import SpeechToText from "./useSpeechRecognitionHook";

import { useMediaQuery } from "@/lib/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

const formSchema = z.object({
  habitname: z
    .string()
    .min(2, {
      message: "Habit names must be at least 2 characters long",
    })
    .max(25, {
      message: "Habit names cannot be longer than 25 characters",
    }),
  goal: z.string().min(1).max(12),
  repeat: z.enum(["daily", "weekly", "monthly"]),
  startdate: z.date(),
});
const HabitsDialog = () => {
  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [user, loading, error] = useAuthState(auth);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitname: "My Habit",
      goal: "1",
      repeat: "daily",
      startdate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createHabit(values);
    form.reset();
    setSelectedIcon("Sun");
    setSelectedColor("blue");
    setOpen(false);
    toast.success("Habit has been created 😎");
  };

  const createHabit = async (values: z.infer<typeof formSchema>) => {
    if (user) {
      const docRef = await addDoc(collection(db, "users", user.uid, "habits"), {
        timestamp: serverTimestamp(),
        habitName: values.habitname,
        goal: values.goal,
        repeat: values.repeat,
        startDate: values.startdate,
        tracked: false,
        completed: false,
        skipped: false,
        failed: false,
        totalCompleted: 0,
        totalSkipped: 0,
        totalFailed: 0,
        streak: 0,
        lastCompletedDate: "",
        hUID: "",
        icon: selectedIcon,
        color: selectedColor,
      });
      // Update the document with the ID
      await updateDoc(docRef, { hUID: docRef.id });
    }
  };

  const [selectedColor, setSelectedColor] = useState("blue"); // State for selected color
  const [selectedIcon, setSelectedIcon] = useState("Sun"); // State for selected icon

  const [audioHabit, setAudioHabit] = useState(false);
  const [audioHabitName, setAudioHabitName] = useState("My Habit"); // State for audio habit name
  const [audioHabitGoal, setAudioHabitGoal] = useState("1"); // State for audio habit goal
  const [audioHabitRepeat, setAudioHabitRepeat] = useState("Daily"); // State for audio habit repeat
  const [audioHabitStartDate, setAudioHabitStartDate] = useState<
    Date | undefined
  >(new Date()); // State for audio habit start date

  const [audioStage, setAudioStage] = useState(0); // State for audio stage

  const createAudioHabit = async () => {
    if (user) {
      const docRef = await addDoc(collection(db, "users", user.uid, "habits"), {
        timestamp: serverTimestamp(),
        habitName: audioHabitName,
        goal: audioHabitGoal,
        repeat: audioHabitRepeat,
        startDate: audioHabitStartDate,
        tracked: false,
        completed: false,
        skipped: false,
        failed: false,
        totalCompleted: 0,
        totalSkipped: 0,
        totalFailed: 0,
        streak: 0,
        lastCompletedDate: "",
        hUID: "",
        icon: selectedIcon,
        color: selectedColor,
      });
      // Update the document with the ID
      await updateDoc(docRef, { hUID: docRef.id });
    }
  };

  const onAudioSubmit = () => {
    createAudioHabit();
    setAudioHabit(false);
    setAudioHabitName("My Habit");
    setAudioHabitGoal("1");
    setAudioHabitRepeat("Daily");
    setAudioHabitStartDate(undefined);
    setAudioStage(0);
    setSelectedIcon("Sun");
    setSelectedColor("blue");
    toast.success("Habit has been created 😎");
  };

  useEffect(() => {
    if (!isListening) {
      setAudioHabitName(text);
    }
  }, [isListening, text, setAudioHabitName]);

  const TextForm = () => {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="habitname"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="Habit Name" />
                      <IconPicker
                        color={selectedColor}
                        icon={selectedIcon}
                        setColor={setSelectedColor}
                        setIcon={setSelectedIcon}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Goal{" "}
                    <span className=" text-muted-foreground ">/per day</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of times to perform habit in a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className=" max-h-48">
                      <SelectGroup>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="9">9</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="11">11</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="repeat"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Repeat</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="When to repeat habit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="startdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  useEffect(() => {
    if (!isListening) {
      if (audioStage === 1) {
        // Update habit name only if we are in stage 1
        setAudioHabitName(text);
        console.log("WE ARE IN STAGE 1")
      } else if (audioStage === 3) {
        // Update habit goal only if we are in stage 3
        setAudioHabitGoal(text);
        console.log("WE ARE IN STAGE 3")
      } else if(audioStage ===5){
        setAudioHabitRepeat(text);
      }
    }
  }, [isListening, text, audioStage]);
  
  

  const GetAudioStage = () => {
    switch (audioStage) {
      case 0:
        return (
          <div className="flex flex-col gap-6 justify-center items-center">
            <Typography variant={"h4"}>
              What will we call your habit?
            </Typography>
            <div className="flex gap-6">
              <Button
                variant={"audioPrimary"}
                // onClick={() => setAudioStage(audioStage + 1)}
                onClick={() => {
                  setAudioStage(audioStage + 1)
                    if (!isListening) {
                      startListening();
                    } else {
                      stopListening();
                    }
                  }}
              >
                <Mic />
              </Button>
            </div>
          </div>
        );
        case 1:
  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <Typography variant={"h4"}>
        What will we call your habit?
      </Typography>
      <div className="flex gap-2 w-full">
        <Input value={audioHabitName} disabled />

        <IconPicker
          color={selectedColor}
          icon={selectedIcon}
          setColor={setSelectedColor}
          setIcon={setSelectedIcon}
        />
      </div>

      <div className="flex gap-6">
        <Button
          variant={"audioSecondary"}
          onClick={() => setAudioStage(audioStage - 1)}
        >
          <RotateCcw />
        </Button>
        <Button
          variant={"audioPrimary"}
          onClick={() => {
            stopListening(); // Ensure we stop listening when the checkmark is clicked
            setAudioStage(audioStage + 1);
          }}
        >
          <Check />
        </Button>
      </div>
    </div>
  );
  case 2:
    return (
      <div className="flex flex-col gap-6 justify-center items-center">
        <Edit
          text={audioHabitName}
          label="Habit Name"
          audioStage={() => setAudioStage(2)}
        />
        <Typography variant={"h4"}>How many times in a day?</Typography>
        
        <div className="flex gap-6">
          <Button
            variant={"audioPrimary"}
            onClick={() => {
              setAudioStage(audioStage + 1)
                if (!isListening) {
                  startListening();
                } else {
                  stopListening();
                }
              }}
          >
            <Mic />
          </Button>
        </div>
      </div>
    ); 
      case 3:
        return (
          <div className="flex flex-col gap-6 justify-center items-center">
            <Edit
              text={audioHabitName}
              label="Habit Name"
              audioStage={() => setAudioStage(3)}
            />

            <Typography variant={"h4"}>How many times in a day?</Typography>
            <Input value={audioHabitGoal} disabled />

            <div className="flex gap-6">
              <Button
                variant={"audioSecondary"}
                onClick={() => setAudioStage(audioStage - 1)}
              >
                <RotateCcw />
              </Button>
              <Button
                // variant={"audioPrimary"}
                // onClick={() => setAudioStage(audioStage + 1)}
                variant={"audioPrimary"}
                onClick={() => {
                  stopListening(); // Ensure we stop listening when the checkmark is clicked
                  setAudioStage(audioStage + 1);
                }}
              >
                <Check />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6 justify-center items-center">
            <Edit
              text={audioHabitName}
              label="Habit Name"
              audioStage={() => setAudioStage(1)}
            />
            <Edit
              text={audioHabitGoal + " /per day"}
              label="Goal"
              audioStage={() => setAudioStage(3)}
            />
            <Typography variant={"h4"}>
              How often should this habit repeat?
            </Typography>
            <div className="flex gap-6">
              <Button
                variant={"audioPrimary"}
                onClick={() => {
                  setAudioStage(audioStage + 1)
                    if (!isListening) {
                      startListening();
                    } else {
                      stopListening();
                    }
                  }}
                  >
                <Mic />
              </Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-6 justify-center items-center">
            <Edit
              text={audioHabitName}
              label="Habit Name"
              audioStage={() => setAudioStage(1)}
            />
            <Edit
              text={audioHabitGoal + " /per day"}
              label="Goal"
              audioStage={() => setAudioStage(3)}
            />
            <Typography variant={"h4"}>
              {" "}
              How often should this habit repeat?
            </Typography>
            <Input value={audioHabitRepeat} disabled />
            <div className="flex gap-6">
              <Button
                variant={"audioSecondary"}
                onClick={() => setAudioStage(audioStage - 1)}
              >
                <RotateCcw />
              </Button>
              <Button
                variant={"audioPrimary"}
                onClick={() => {
                  stopListening(); // Ensure we stop listening when the checkmark is clicked
                  setAudioStage(audioStage + 1);
                }}
              >
                <Check />
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-6 justify-center items-center">
            <Edit
              text={audioHabitName}
              label="Habit Name"
              audioStage={() => setAudioStage(1)}
            />
            <Edit
              text={audioHabitGoal + " /per day"}
              label="Goal"
              audioStage={() => setAudioStage(3)}
            />
            <Edit
              text={audioHabitRepeat}
              label="Repeat"
              audioStage={() => setAudioStage(5)}
            />
            <Typography variant={"h4"}>When do you want to start?</Typography>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !audioHabitStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {audioHabitStartDate ? (
                    format(audioHabitStartDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={audioHabitStartDate}
                  onSelect={setAudioHabitStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="flex gap-6">
              <DialogClose>
                <Button variant={"audioPrimary"} onClick={onAudioSubmit}>
                  <Check />
                </Button>
              </DialogClose>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Add Habit
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>New Habit</DialogTitle>
              {!audioHabit ? (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setAudioHabit(true)}
                >
                  <Mic className="text-destructive" />
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setAudioHabit(false)}
                >
                  <Keyboard className="text-primary" />
                </Button>
              )}
            </div>
          </DialogHeader>
          {audioHabit ? <GetAudioStage /> : <TextForm />}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus /> Add Habit
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6">
        <DrawerHeader className="text-left">
          <div className="flex justify-between items-centern w-full">
            <DrawerTitle>New Habit</DrawerTitle>
            {!audioHabit ? (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setAudioHabit(true)}
              >
                <Mic className="text-destructive" />
              </Button>
            ) : (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setAudioHabit(false)}
              >
                <Keyboard className="text-primary" />
              </Button>
            )}
          </div>
        </DrawerHeader>
        {audioHabit ? <GetAudioStage /> : <TextForm />}
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default HabitsDialog;