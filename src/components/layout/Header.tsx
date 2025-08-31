export default function Header() {
  return (
    <header id="site-header" className="relative z-50 w-full h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-10 px-6 md:px-10 lg:px-16 py-6">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-bold">Fredy Portfolio</div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#work" className="text-white/80 hover:text-white transition-colors">Work</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="mx-auto h-full max-w-7xl px-6 md:px-10 lg:px-16 flex flex-col justify-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Creative Developer
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Crafting digital experiences that blend innovation with purpose. 
            From interactive 3D to seamless web applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
              View My Work
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors">
              Get In Touch
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm">React</span>
            <span className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm">Next.js</span>
            <span className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm">Spline</span>
            <span className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm">Three.js</span>
            <span className="px-4 py-2 bg-white/10 text-white/90 rounded-full text-sm">UI/UX</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </header>
  );
}


