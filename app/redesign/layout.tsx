import type { Metadata } from "next";
import RedesignShell from "./RedesignShell";

export const metadata: Metadata = {
  title: "Fredy · Redesign",
  description: "Portfolio redesign — bento grid from Figma Portfolio-2",
};

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen font-poppins antialiased">
      <RedesignShell>{children}</RedesignShell>
    </div>
  );
}
