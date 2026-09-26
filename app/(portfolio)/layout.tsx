import type { Metadata } from "next";

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
    <div className="min-h-screen bg-black font-poppins antialiased">{children}</div>
  );
}
