import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import AICompanion from "@/components/AICompanion";
import VoiceActionOrb from "@/components/VoiceActionOrb";
import CommandCenter from "@/components/CommandCenter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Task Master",
  description: "Next Generation Productivity Workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#0B1437] transition-colors`}
      >
        <TopNav />
        {children}

        {/* Global AI Features */}
        <AICompanion />
        <VoiceActionOrb />
        <CommandCenter />
      </body>
    </html>
  );
}
