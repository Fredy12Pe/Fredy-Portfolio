import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fredy Design",
  description: "Designer & Developer — Fredy Pedro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
        {/* Top sentinel — Safari 26 samples this to color the status bar (time/battery area) */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            backgroundColor: "#FFF4D5",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
        {/* Safari 26 URL-bar sentinel — full-width fixed element at bottom so it always qualifies for sampling */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "linear-gradient(to bottom, transparent 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      </body>
    </html>
  );
}
