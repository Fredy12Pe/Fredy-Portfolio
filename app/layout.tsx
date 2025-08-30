import "./globals.css";

export const metadata = {
  title: "fredyPortfolio",
  description: "Portfolio case studies and projects",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
