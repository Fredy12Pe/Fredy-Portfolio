import "./globals.css";

export const metadata = {
  title: "fredyPortfolio",
  description: "Portfolio case studies and projects",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" 
          as="style" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Preload critical images */}
        <link rel="preload" as="image" href="/images/hero/Fredy-header.png" />
        <link rel="preload" as="image" href="/images/hero/Fredy-header-mobile.png" />
      </head>
      <body className="bg-black text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
