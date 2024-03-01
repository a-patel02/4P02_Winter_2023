import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import {
  useCollection,
  useDocument,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

import { CalendarIcon, Plus } from "lucide-react";

import { Label } from "./ui/label";
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
  const [user, loading, error] = useAuthState(auth);

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Add Habit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Habit</DialogTitle>
        </DialogHeader>

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
                      <span className=" text-muted-foreground ">/per day</span>{" "}
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
              <DialogClose>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitsDialog;
