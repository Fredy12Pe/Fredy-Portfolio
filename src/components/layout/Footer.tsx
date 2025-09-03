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
        <div className="flex items-center gap-3">
          <a href="#" aria-label="LinkedIn" className="text-white/80 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V22h-4V8.5zM8.5 8.5h3.8v1.84h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.08V22h-4v-5.74c0-1.37-.02-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V22h-4V8.5z"/>
            </svg>
          </a>
          <a href="#" aria-label="GitHub" className="text-white/80 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.78-1.35-1.78-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.39 1.25-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.66.25 2.88.12 3.18.78.84 1.25 1.91 1.25 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 .5z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}


