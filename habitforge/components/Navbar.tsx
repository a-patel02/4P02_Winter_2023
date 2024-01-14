import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="flex justify-between p-8">
      <div className="flex justify-between w-full">
        <Link href={"/"}>
          <Button variant={"link"}>Home</Button>
        </Link>

        <div className="flex gap-5">
          <Link href={"/login"}>
            <Button variant={"secondary"}>Register</Button>
          </Link>
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
