import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investigate — SONA",
};

export default function InvestigateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
