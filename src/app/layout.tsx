import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import GlobalFloatingWidgets from "@/components/GlobalFloatingWidgets";
import ClientOnly from "@/components/ClientOnly";
import PWAInstaller from "@/components/PWAInstaller";


const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "AI Task Master | Elite Productivity",
  description: "Advanced AI-driven task management for the high-performance professional.",
  manifest: "/manifest.json",
  themeColor: "#4318FF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TaskMaster Elite",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased bg-slate-50 dark:bg-[#020617] overflow-x-hidden selection:bg-[#4318FF] selection:text-white`}>
        <div className="mesh-gradient" />
        <div className="neural-grid" />
        <div className="scanline" />
        
        <ClientOnly>
          <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-[9999] opacity-30" />
          <TopNav />
          <GlobalFloatingWidgets />
          <PWAInstaller />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
