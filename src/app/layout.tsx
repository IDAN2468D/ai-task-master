import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import GlobalFloatingWidgets from "@/components/GlobalFloatingWidgets";
import ClientOnly from "@/components/ClientOnly";
import PWAInstaller from "@/components/PWAInstaller";


const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
  display: 'swap',
});

export const viewport = {
  themeColor: "#4318FF",
};

export const metadata: Metadata = {
  title: "AI Task Master - מנהל משימות חכם",
  description: "מערכת ניהול משימות חכמה מבוססת בינה מלאכותית",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Task Master",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${rubik.variable} font-sans antialiased bg-slate-50 dark:bg-[#0B1437]`}>
        <ClientOnly>
          <TopNav />
          <GlobalFloatingWidgets />
          <PWAInstaller />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
