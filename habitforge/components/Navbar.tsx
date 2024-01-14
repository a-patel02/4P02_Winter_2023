import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  return (
    <div className="flex justify-between p-8">
      <div className="flex justify-between w-full items-center">
        <Link href={"/"}>
          <div className="flex items-center">
            <img
              src="/logoDark.svg"
              alt=""
              className="dark:hidden mr-3 h-8  block w-auto"
            />
            <img
              src="/logoLight.svg"
              alt=""
              className="hidden dark:block mr-3 h-8 w-auto"
            />
            <h4 className="text-lg font-bold hidden sm:block">HabitForge</h4>
          </div>
        </Link>
        {/* <Link href={"/"}>
          <Button variant={"link"}>Home</Button>
        </Link> */}
        <div className="flex gap-4">
          <Link href={"/register"}>
            <Button>Log in</Button>
          </Link>
          <ModeToggle></ModeToggle>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
