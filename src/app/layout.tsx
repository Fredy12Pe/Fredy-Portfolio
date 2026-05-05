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
        {/* Fixed sentinel Safari 26 samples to color the URL bar — must be ≥80% wide, ≥3px tall, within 3px of bottom */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            bottom: 0,
            left: "10%",
            width: "80%",
            height: "3px",
            background: "#000000",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      </body>
    </html>
  );
}
