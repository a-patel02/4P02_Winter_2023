import Image from "next/image";
import { FC } from "react";
import Typography from "../ui/typography-variants";

interface PodiumProps {
  level: number;
  name: string;
  rank: number;
  photoURL: string;
  className?: string;
}

const Podium: FC<PodiumProps> = ({
  level,
  name,
  rank,
  photoURL,
  className,
}) => {
  return (
    <div
      className={`flex w-full p-4 pt-10 flex-col items-center relative bg-secondary rounded-lg border-t-2  ${
        level == 1
          ? "border-yellow-500"
          : level == 2
          ? "border-slate-400"
          : level == 3
          ? "border-amber-700"
          : ""
      } ${className}`}
    >
      {level == 1 ? (
        <Image
          src="Gold.svg"
          height={50}
          width={50}
          alt="Gold"
          className="absolute -top-6 translate-x-1/2 right-1/2 "
        />
      ) : level == 2 ? (
        <Image
          src="Silver.svg"
          height={50}
          width={50}
          alt="Silver"
          className="absolute -top-6 translate-x-1/2 right-1/2 "
        />
      ) : level == 3 ? (
        <Image
          src="Bronze.svg"
          height={50}
          width={50}
          alt="Bronze"
          className="absolute -top-6 translate-x-1/2 right-1/2 "
        />
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-4 w-full justify-center text-center">
        <div className="flex gap-2 items-center justify-center">
          <img
            src={photoURL}
            height={30}
            width={30}
            alt="User"
            className="rounded-full"
          />
          <Typography variant={"h4"}>{name}</Typography>
        </div>
        <hr className="w-full h-[3px] bg-background/10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Typography
            variant={"p"}
            affects={"small"}
            className="!mt-0 text-muted-foreground"
          >
            Rank
          </Typography>
          <Typography variant={"h4"} className="!mt-0">
            {rank}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Podium;
