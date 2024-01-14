"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { AuthContextProvider } from "@/app/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "HabitForge",
//   description: "HabitForge is a habit tracking app.",
//   icons: {
//     icon: [
//       {
//         media: "(prefers-color-scheme: light)",
//         url: "/logoDark.svg",
//         href: "/logoDark.svg",
//       },
//       {
//         media: "(prefers-color-scheme: dark)",
//         url: "/logoLight.svg",
//         href: "/logoLight.svg",
//       },
//     ],
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
