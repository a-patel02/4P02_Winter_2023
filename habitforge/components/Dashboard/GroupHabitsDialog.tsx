import {
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
  DocumentReference,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

import { CalendarIcon, PencilLine, Plus } from "lucide-react";

import { Input } from "../ui/input";
import { format, set } from "date-fns";
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
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";
import { IconPicker } from "../IconPicker";
import { FC, useState } from "react";
import Typography from "../ui/typography-variants";
import Edit from "../Edit";

import { useMediaQuery } from "@/lib/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";

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

const formSchem1 = z.object({
  email: z.string().email(),
});

interface GroupHabitsDialogProps {
  edit?: boolean;
  hUID?: string;
  habitName?: string;
  goal?: number;
  color?: string;
  icon?: string;
  repeat?: "daily" | "weekly" | "monthly";
  groupEmails?: any[];
  groupID?: string;
}

const GroupHabitsDialog: FC<GroupHabitsDialogProps> = ({
  edit,
  hUID,
  habitName,
  goal,
  color,
  icon,
  repeat,
  groupEmails,
  groupID,
}) => {
  const [user, loading, error] = useAuthState(auth);
  const [value, loading1, error1] = useCollectionData(collection(db, "users"));
  const [selectedColor, setSelectedColor] = useState(color ?? "blue"); // State for selected color
  const [selectedIcon, setSelectedIcon] = useState(icon ?? "Sun"); // State for selected icon
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>(groupEmails ?? []);
  const [uid, setUID] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      habitname: habitName || "My Habit",
      goal: goal?.toString() || "1",
      repeat: repeat || "daily",
      startdate: new Date(),
    },
  });

  const form2 = useForm<z.infer<typeof formSchem1>>({
    resolver: zodResolver(formSchem1),
    defaultValues: {
      email: "",
    },
  });

  const onEmailSubmit = (values: z.infer<typeof formSchem1>) => {
    setEmails((prevEmails) => [...prevEmails, values.email]);
    form2.reset();
  };

  const getUID = () => {
    value?.map((recievedUsers) => {
      if (emails.includes(recievedUsers.email)) {
        if (user?.uid !== recievedUsers.uid) uid.push(recievedUsers.uid);
      }
    });
  };

  const createHabit = async (values: z.infer<typeof formSchema>) => {
    if (user) {
      if (edit && hUID && groupID) {
        await updateDoc(doc(db, "users", user.uid, "habits", hUID), {
          timestamp: serverTimestamp(),
          habitName: values.habitname,
          goal: values.goal,
          repeat: values.repeat,
          startDate: values.startdate,
          icon: selectedIcon,
          color: selectedColor,
        });

        uid.forEach(async (uid) => {
          value?.map(async (value) => {
            if (value.uid === uid) {
              await setDoc(doc(db, "groups", groupID, "members", value.uid), {
                uid: value.uid,
                email: value.email,
                displayName: value.displayName,
                photoURL: value.photoURL,
                status: "pending",
              });
            }
          });
        });

        //send invite
        if (uid.length > 0) {
          const titleSentence = edit
            ? " has edited your Group Habit to "
            : " has invited you to join their Group Habit: ";
          uid.forEach(async (id) => {
            await setDoc(doc(db, "users", id, "notifications", groupID), {
              timestamp: serverTimestamp(),
              title: user.displayName + titleSentence + values.habitname,
              senderUID: user.uid,
              hUID: hUID,
              status: "pending",
              groupID: groupID,
              edit: edit,
            });
          });
        }
      } else {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "habits"),
          {
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
            groupID: "",
          }
        );
        await updateDoc(docRef, { hUID: docRef.id });

        //create group
        const groupRef = await addDoc(collection(db, "groups"), {
          hUID: docRef.id,
          groupID: "",
        });
        await updateDoc(groupRef, { groupID: groupRef.id });
        await updateDoc(docRef, { groupID: groupRef.id });

        await setDoc(doc(db, "groups", groupRef.id, "members", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          status: "accepted",
        });

        uid.forEach(async (uid) => {
          value?.map(async (value) => {
            if (value.uid === uid) {
              await setDoc(
                doc(db, "groups", groupRef.id, "members", value.uid),
                {
                  uid: value.uid,
                  email: value.email,
                  displayName: value.displayName,
                  photoURL: value.photoURL,
                  status: "pending",
                }
              );
            }
          });
        });

        //send invite
        if (uid.length > 0) {
          uid.forEach(async (id) => {
            await setDoc(doc(db, "users", id, "notifications", groupRef.id), {
              timestamp: serverTimestamp(),
              title:
                user.displayName +
                " has invited you to join their Group Habit: " +
                values.habitname,
              senderUID: user.uid,
              hUID: docRef.id,
              status: "pending",
              groupID: groupRef.id,
            });
          });
        }
      }
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    getUID();
    createHabit(values);
    form.reset();
    setSelectedIcon("Sun");
    setSelectedColor("blue");
    setEmails([]);
    setUID([]);
    setOpen(false);
    {
      edit
        ? toast.success("Habit has been edited 😎")
        : toast.success("Habit has been created 😎");
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              form.reset();
              form2.reset();
              console.log("groupEmails: ", groupEmails);
              setEmails(groupEmails ?? []);
              setSelectedIcon(icon ?? "Sun");
              setSelectedColor(color ?? "blue");
            }}
            variant={edit ? "secondary" : "default"}
          >
            {edit ? <PencilLine /> : <Plus />}
            {edit ? "Edit Habit" : "Add Habit"}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{edit ? "Edit Habit" : "New Habit"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
              id="habit-form"
            >
              <FormField
                control={form.control}
                name="habitname"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel> Habit Name</FormLabel>
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
                        <span className=" text-muted-foreground ">
                          /per day
                        </span>
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
            </form>
          </Form>
          <Form {...form2}>
            <form
              onSubmit={form2.handleSubmit(onEmailSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <FormField
                control={form2.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Invite Group Members</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Email to send invite too"
                          />
                        </FormControl>
                        <Button variant={"ghost"} size={"icon"} type="submit">
                          <Plus />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
          <div className="flex flex-col gap-2">
            {emails.map((email, index) => (
              <Typography
                key={index}
                variant={"p"}
                className="!mt-0"
                affects={"muted"}
              >
                {email}
              </Typography>
            ))}
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="habit-form">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          onClick={() => {
            form.reset();
            form2.reset();
            console.log("groupEmails: ", groupEmails);
            setEmails(groupEmails ?? []);
            setSelectedIcon(icon ?? "Sun");
            setSelectedColor(color ?? "blue");
          }}
          variant={edit ? "secondary" : "default"}
        >
          {edit ? <PencilLine /> : <Plus />}
          {edit ? "Edit Habit" : "Add Habit"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-6">
        <DrawerHeader className="text-left px-0">
          <DrawerTitle>New Habit</DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full flex-col gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
              id="habit-form"
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
                        <span className=" text-muted-foreground ">
                          /per day
                        </span>
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
            </form>
          </Form>
          <Form {...form2}>
            <form
              onSubmit={form2.handleSubmit(onEmailSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <FormField
                control={form2.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Invite Group Members</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Email to send invite too"
                          />
                        </FormControl>
                        <Button variant={"ghost"} size={"icon"} type="submit">
                          <Plus />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>
          <div className="flex flex-col gap-2">
            {emails.map((email, index) => (
              <Typography
                key={index}
                variant={"p"}
                className="!mt-0"
                affects={"muted"}
              >
                {email}
              </Typography>
            ))}
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="habit-form">
              Save
            </Button>
          </DialogFooter>
        </div>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default GroupHabitsDialog;
