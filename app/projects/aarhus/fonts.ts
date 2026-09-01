import { Cormorant_Garamond, Geist } from "next/font/google";

export const aarhusSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-aarhus-sans",
  display: "swap",
});

export const aarhusSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-aarhus-serif",
  display: "swap",
});
