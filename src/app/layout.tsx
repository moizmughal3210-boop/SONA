import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SONA — Audio Misinformation Investigation Platform",
  description: "Because truth shouldn't be hard to hear.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎙️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col relative bg-[#0A0A0F]">
        <ScrollProgress />
        <CursorGlow />
        <div className="z-10 flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
