import Image from "next/image";
'use client'
import Typography from "@/components/ui/typography-variants";


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-9">
        <Typography variant="h1">Testing</Typography>
        <Typography variant="h2">This is a heading 2</Typography>
        <Typography variant="h3">This is a heading 3</Typography>
        <Typography variant="h4">This is a heading 4</Typography>
        <div>
          <Typography variant="p">This is a paragraph</Typography>
          <Typography variant="p" affects={"lead"}>
            This is a lead
          </Typography>
        
        </div>
      </div>
      
    </main>
  );
}
