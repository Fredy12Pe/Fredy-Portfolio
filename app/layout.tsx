import "./globals.css";

export const metadata = {
  title: "Fredy · Portfolio",
  description:
    "Fredy is a UI/UX designer and front-end developer. Explore selected projects, about, and contact.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@500;700&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@500;700&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
