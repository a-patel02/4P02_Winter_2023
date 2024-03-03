import { FC } from "react";
import { Label } from "./ui/label";
import Typography from "./ui/typography-variants";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

export interface EditProps {
  label: string;
  text: string;
  audioStage: () => void;
}

const Edit: FC<EditProps> = ({ label, text, audioStage }) => {
  return (
    <div className="flex justify-between w-full items-center border-b pb-2">
      <div className="flex flex-col gap-2">
        <Typography variant={"p"} affects={"muted"} className="!mt-0">
          {label}
        </Typography>
        <Typography variant={"p"} className="!mt-0 font-bold" affects={"small"}>
          {text}
        </Typography>
      </div>
      <Button variant={"ghost"} size={"icon"} onClick={audioStage}>
        <Pencil className="h-5" />
      </Button>
    </div>
  );
};

export default Edit;
