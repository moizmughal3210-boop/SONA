import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import SpaceBackground from "@/components/SpaceBackground";
import MicCursor from "@/components/MicCursor";
import AppLayout from "@/components/layout/AppLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const urduFont = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SONA 🇵🇰 — Pakistan Ka AI Investigation Platform",
  description: "SONA Pakistan ka pehla AI investigation platform hai jo suspicious audio aur voice notes ko Urdu mein fact-check karta hai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${urduFont.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col relative bg-background text-foreground overflow-hidden">
        <SpaceBackground />
        <MicCursor />
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
