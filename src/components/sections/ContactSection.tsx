"use client";
import Image from "next/image";
import { useState } from "react";
import emailjs from '@emailjs/browser';

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Check if EmailJS is properly configured
    const isEmailJSConfigured = 
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID && 
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    console.log('EmailJS Configuration Check:', {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? 'Set' : 'Missing',
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? 'Set' : 'Missing',
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Set' : 'Missing',
      isConfigured: isEmailJSConfigured
    });

    if (!isEmailJSConfigured) {
      console.log('EmailJS not configured, falling back to mailto');
      // Fallback to mailto if EmailJS is not configured
      const subject = `Portfolio Contact from ${name}`;
      const body = `Hi Fredy,\n\n${message}\n\nBest regards,\n${name}\n${email}`;
      const mailtoLink = `mailto:Fredy23pedro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      setIsLoading(false);
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      to_email: 'Fredy23pedro@gmail.com'
    };

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      
      console.log('Email sent successfully:', result);
      setIsSent(true);
      (e.target as HTMLFormElement).reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSent(false), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      // Fallback to mailto on error
      const subject = `Portfolio Contact from ${name}`;
      const body = `Hi Fredy,\n\n${message}\n\nBest regards,\n${name}\n${email}`;
      const mailtoLink = `mailto:Fredy23pedro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      setIsSent(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setIsSent(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto mt-12 md:mt-24 max-w-[100rem] px-4 md:px-8">
      <div className="relative overflow-hidden rounded-[20px] ring-1 ring-white/10 group">
        {/* Background image */}
        <img
          src="/images/projects/tidehaus-thumbnail.png"
          alt="Tidehaus background"
          className="object-cover w-full h-full absolute inset-0"
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
            onSubmit={handleSubmit}
            className="md:col-start-1 md:row-start-2 mt-2 md:mt-0 space-y-4 max-w-xl"
          >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-5 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-5 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <textarea
                name="message"
                placeholder="Tell me about the role or your team..."
                rows={4}
                required
                className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-5 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-white px-6 py-5 text-black font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
              
              {/* Success Message */}
              {isSent && (
                <div className="mt-4 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-400 text-center">
                  ✅ Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">
                  ❌ {error}
                </div>
              )}
          </form>

          {/* Right: Profile Card */}
          <div className="md:col-start-2 md:row-start-2 flex items-start justify-center md:justify-end mt-6 md:mt-0">
            <div className="w-full md:w-[520px] rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 backdrop-blur-xl">
              <div className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl">Fredy Pedro</div>
              <div className="mt-3 text-white/85 text-lg">UI/UX Designer &amp; Developer</div>
              <div className="mt-6 flex gap-3">
                <a
                  href="/mainPage%20Assets/Contact/Fredy%20Pedro%20-%20Resume.pdf"
                  download="Fredy Pedro - Resume.pdf"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-black font-semibold hover:bg-white/90 transition-colors"
                >
                  Download Resume
                </a>
                <a
                  href="/mainPage%20Assets/Contact/Fredy%20Pedro%20-%20Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-4 text-white font-semibold hover:bg-white/20 transition-colors backdrop-blur-md"
                >
                  View Resume
                </a>
              </div>
              {/* In-card socials */}
              <div className="mt-6 flex gap-3">
                <a href="https://www.linkedin.com/in/fredy-pedro-895ba6155" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V22h-4V8.5zM8.5 8.5h3.8v1.84h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.08V22h-4v-5.74c0-1.37-.02-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V22h-4V8.5z"/>
                  </svg>
                </a>
                <a href="https://github.com/Fredy12Pe" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.78-1.35-1.78-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.39 1.25-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.66.25 2.88.12 3.18.78.84 1.25 1.91 1.25 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 .5z" />
                  </svg>
                </a>
              </div>
              
              {/* Phone number */}
              <div className="mt-4 flex items-center gap-3 text-white/85">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <a href="tel:+12132146368" className="text-white/85 hover:text-white transition-colors">
                  (213) 214-6368
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


