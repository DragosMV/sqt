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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
            <Link href={"/"}>
              <h1 className="font-geist-sans text-base sm:text-lg font-bold italic textGradient">
                Software Quality Temple
              </h1>
            </Link>
            <Logout />
          </header>

          {/* Main should grow to fill available space */}
          <main className="flex-grow flex flex-col">{children}</main>

          <footer className="p-4 sm:p-8 grid place-items-center">
            <p className="font-bold">Hello there!😉</p>
          </footer>
        </body>
      </AuthProvider>
    </html>
  );
}
