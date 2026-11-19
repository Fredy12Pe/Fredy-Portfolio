import type { Metadata, Viewport } from "next";
import "./aarhus-fonts.css";
import ArborChrome from "./ArborChrome";
import { roboto } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Modular Living · Arbor & Co.",
  description:
    "A case study in product interaction — four configurable pieces, each with a spatial scene you can open, light, and rearrange.",
};

export const viewport: Viewport = {
  themeColor: "#F9F8F5",
};

export default function AarhusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aarhus is set in Roboto, so only this page loads it
  return (
    <div className={roboto.variable} style={{ display: "contents" }}>
      <ArborChrome>{children}</ArborChrome>
    </div>
  );
}
