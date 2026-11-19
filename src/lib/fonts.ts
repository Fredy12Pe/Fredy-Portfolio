import { Fredoka, Inter, JetBrains_Mono, Orbitron, Roboto } from "next/font/google";

// Inter: every page's text. JetBrains Mono: small uppercase labels.
// Orbitron (Mood Tracker) and Roboto (Aarhus) are loaded only by the pages that use them.
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
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
