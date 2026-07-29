import type { Metadata } from "next";
import RedesignShell from "../redesign/RedesignShell";

export const metadata: Metadata = {
  title: {
    default: "Fredy · Portfolio",
    template: "Fredy · %s",
  },
  description:
    "Fredy is a UI/UX designer and front-end developer. Explore selected projects, about, and contact.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-poppins antialiased">
      <RedesignShell>{children}</RedesignShell>
    </div>
  );
}
