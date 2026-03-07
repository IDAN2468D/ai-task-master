import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import GlobalFloatingWidgets from "@/components/GlobalFloatingWidgets";
import ClientOnly from "@/components/ClientOnly";

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
  display: 'swap',
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
    <html lang="he" dir="rtl">
      <body className={`${rubik.variable} font-sans antialiased bg-slate-50 dark:bg-[#0B1437]`}>
        <ClientOnly>
          <TopNav />
          <GlobalFloatingWidgets />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
