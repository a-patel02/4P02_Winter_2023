import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import FirebaseMessagingComponent from '@/firebase/firebaseMessagingComponent';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HabitForge",
  description: "HabitForge is a habit tracking app.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logoDark.svg",
        href: "/logoDark.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logoLight.svg",
        href: "/logoLight.svg",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <FirebaseMessagingComponent /> {/* Wrap with useClient */}
          {children}
          <Toaster position="top-right" richColors />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
