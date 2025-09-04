"use client";
import Image from "next/image";
import tidehausImg from "../../../app/mainPage Assets/highlighted work/tidehaus thumbnail.png";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto mt-12 md:mt-24 max-w-[100rem] px-4 md:px-8">
      <div className="relative overflow-hidden rounded-[20px] ring-1 ring-white/10 group">
        {/* Background image */}
        <Image
          src={tidehausImg}
          alt="Tidehaus background"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Blur overlay above the image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.60)",
            borderRadius: 20,
            backdropFilter: "blur(90px)",
          }}
        />

        {/* Ambient mouse spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onMouseMove={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.background = `radial-gradient(220px 220px at ${x}px ${y}px, rgba(255,255,255,0.18), rgba(255,255,255,0.0) 60%)`;
            el.style.mixBlendMode = 'screen';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.background = 'transparent';
          }}
          style={{ borderRadius: 20 }}
        />

        {/* Foreground content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto] gap-8 p-6 md:p-10 lg:p-16">
          {/* Left: Heading + Description */}
          <div className="md:col-start-1 md:row-start-1">
            <h2 className="text-white uppercase font-black tracking-tight text-[36px] sm:text-[56px] md:text-[64px] lg:text-[72px] leading-[0.95]">
              Get in touch
            </h2>
            <p className="mt-4 max-w-xl text-white/85 text-base md:text-lg">
              Currently looking for new opportunities in UI/UX + Frontend Dev Roles. Let&apos;s connect.
            </p>
          </div>

          {/* Left: Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="md:col-start-1 md:row-start-2 mt-2 md:mt-0 space-y-4 max-w-xl"
          >
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-5 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <input
                type="email"
                placeholder="jane@email.com"
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-5 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <textarea
                placeholder="Tell me about the role or your team..."
                rows={4}
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-5 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-white px-6 py-5 text-black font-semibold hover:bg-white/90 transition-colors"
              >
                Send Message
              </button>
          </form>

          {/* Right: Profile Card */}
          <div className="md:col-start-2 md:row-start-2 flex items-start justify-center md:justify-end mt-6 md:mt-0">
            <div className="w-full md:w-[520px] rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <div className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl">Fredy Pedro</div>
              <div className="mt-3 text-white/85 text-lg">UI/UX Designer &amp; Developer</div>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-black font-semibold hover:bg-white/90 transition-colors"
                >
                  Download Resume
                </a>
              </div>
              {/* In-card socials */}
              <div className="mt-6 flex gap-3">
                <a href="#" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V22h-4V8.5zM8.5 8.5h3.8v1.84h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.08V22h-4v-5.74c0-1.37-.02-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V22h-4V8.5z"/>
                  </svg>
                </a>
                <a href="#" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.78-1.35-1.78-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.39 1.25-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.66.25 2.88.12 3.18.78.84 1.25 1.91 1.25 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 .5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom-right socials removed as requested */}
        </div>
      </div>
    </section>
  );
}


