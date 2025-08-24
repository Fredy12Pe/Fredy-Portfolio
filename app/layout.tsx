import "./globals.css";

export const metadata = {
  title: "fredyPortfolio",
  description: "Portfolio case studies and projects",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-800 antialiased">{children}</body>
    </html>
  );
}
