import "./globals.css";

import localFont from "next/font/local";

import Providers from "@/app/providers";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const fontSans = localFont({
  src: "./general-sans.ttf",
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable)}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container flex-1 pb-20">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}