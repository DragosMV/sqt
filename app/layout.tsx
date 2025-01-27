import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";
import Logout from "@/components/Logout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SoftwareQualityTemple",
  description: "Learn software testing in a gamified way!",
};

export default function RootLayout({
  children,
}: Readonly <{ children: React.ReactNode; }>)
 {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <Link href={'/'}>
      <h1 className={`${geistSans.variable} font-geist-sans text-base sm:text-lg font-bold italic textGradient`}>Software Quality Temple</h1>
      </Link>
      <Logout/>
    </header>
  )

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={`${geistSans.variable} font-bold`}>Hello there!😉</p>
    </footer>
  )
  return (
    <html lang="en">
      <AuthProvider>
      <body
        className={`'w-full max-w-[1920px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800 ' + ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {header}
        {children}
        {footer}
      </body>
    </AuthProvider>
    </html>
  );
}
