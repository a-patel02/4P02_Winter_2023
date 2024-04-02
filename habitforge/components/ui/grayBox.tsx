import React, { FC } from "react";
import Typography from "./typography-variants";

interface GrayBoxProps {
    title: string;
    totalCompleted: number;
}

const GrayBox: FC<GrayBoxProps> = ({ title, totalCompleted }) => {
    return (
        <div id="gray-box" className="flex flex-row gap-10">
            <div id="labelAndText" className="flex flex-col bg-[#F1F5F9] w-60 mt-5 rounded-lg p-2">
                <Typography variant="p" affects="lead" className="!mt-0 text-base">
                    {title}
                </Typography>
                <Typography variant="h3" className="!mt-0 pt-2">{totalCompleted}</Typography>
            </div>
        </div>
    );
};

export default GrayBox;