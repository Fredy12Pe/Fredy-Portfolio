import type { ReactNode } from "react";
import { notFound } from "next/navigation";

// A work-in-progress page: it opens while developing locally, and is "not found" on the live site
export default function DevOnlyLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
