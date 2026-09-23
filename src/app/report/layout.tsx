import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investigation Report — SONA",
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
