import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import GlobalFloatingWidgets from "@/components/GlobalFloatingWidgets";
import ClientOnly from "@/components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Task Master - מנהל משימות חכם",
  description: "מערכת ניהול משימות חכמה מבוססת בינה מלאכותית",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#0B1437]`}>
        <ClientOnly>
          <TopNav />
        </ClientOnly>

        {children}

        <ClientOnly>
          <GlobalFloatingWidgets />
        </ClientOnly>
      </body>
    </html>
  );
}
