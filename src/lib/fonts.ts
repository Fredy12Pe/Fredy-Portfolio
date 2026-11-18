import { Fredoka, Inter, Orbitron, Roboto } from "next/font/google";

// Orbitron: display type. Roboto: all body and interface text.
// Inter: the Featured work section only, to match its Figma design.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// Fredoka: the rounded type of the mood tracker's question, on the header ticket's mood view
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});
