import type { Metadata, Viewport } from "next";
import "./aarhus-fonts.css";

export const metadata: Metadata = {
  title: "Modular Living · Arbor & Co.",
  description:
    "A case study in product interaction — four configurable pieces, each with a spatial scene you can open, light, and rearrange.",
};

export const viewport: Viewport = {
  themeColor: "#F9F8F5",
};

import ArborChrome from "./ArborChrome";

export default function AarhusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ArborChrome>{children}</ArborChrome>;
}
