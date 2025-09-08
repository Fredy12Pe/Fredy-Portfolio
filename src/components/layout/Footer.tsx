export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-[100rem] px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white/70 text-sm">
          © {new Date().getFullYear()} Fredy Pedro. All rights reserved.
        </div>
        <nav className="flex items-center gap-6 text-white/80 text-sm">
          <a href="#projects" className="hover:text-white">Projects</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#favorite-stack" className="hover:text-white">Stack</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
      </div>
    </footer>
  );
}


