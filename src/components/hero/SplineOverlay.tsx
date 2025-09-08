"use client";
import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineOverlay() {
  const [active, setActive] = useState(true);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const appRef = useRef<any | null>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const deltaRef = useRef(0);

  // Ensure page starts at top on load and hide content during loading
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('overlay-loading');
    return () => document.body.classList.remove('overlay-loading');
  }, []);

  // Remove loading class when overlay is dismissed
  useEffect(() => {
    if (!active && splineLoaded) {
      document.body.classList.remove('overlay-loading');
    }
  }, [active, splineLoaded]);

  // Pin header beneath overlay so it shows through transparent Spline
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    // Header should always be visible as background, just pinned when overlay is active
    header.style.visibility = 'visible';
    header.classList.toggle("is-pinned", active);
    return () => {
      header.classList.remove("is-pinned");
    };
  }, [active]);

  // Lock page scroll while overlay is active
  useEffect(() => {
    const lock = (on: boolean) => {
      if (on) {
        document.documentElement.classList.add("body-locked");
        document.body.classList.add("body-locked");
      } else {
        document.documentElement.classList.remove("body-locked");
        document.body.classList.remove("body-locked");
      }
    };
    lock(active);
    return () => {
      // Always ensure scroll is unlocked on cleanup
      document.documentElement.classList.remove("body-locked");
      document.body.classList.remove("body-locked");
    };
  }, [active]);

  // Option: Re-activate overlay when scrolling back to top (currently disabled for better UX)
  // useEffect(() => {
  //   const onScroll = () => {
  //     if (window.scrollY <= 50 && !active) {
  //       setActive(true);
  //       progressRef.current = 1;
  //     }
  //   };
  //   window.addEventListener("scroll", onScroll, { passive: true });
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [active]);

  // Direct camera animation: move camera Z from 1523 (start) to -2020 (end)
  useEffect(() => {
    if (!active) return;
    const animateCamera = (t: number) => {
      const app = appRef.current;
      if (!app) {
        console.log('No app ref');
        return;
      }
      
      console.log('Progress:', t, 'App:', app);
      
      try {
        // Try multiple ways to access the camera
        let camera = null;
        
        // Method 1: Direct app.camera
        if (app.camera) {
          camera = app.camera;
          console.log('Found camera via app.camera');
        }
        
        // Method 2: Scene traversal
        if (!camera && app.scene) {
          const findCamera = (obj: any): any => {
            if (obj.type === 'PerspectiveCamera') return obj;
            if (obj.children) {
              for (const child of obj.children) {
                const found = findCamera(child);
                if (found) return found;
              }
            }
            return null;
          };
          camera = findCamera(app.scene);
          if (camera) console.log('Found camera via scene traversal');
        }
        
        // Method 3: findObjectByName if camera has a name
        if (!camera && app.findObjectByName) {
          camera = app.findObjectByName('Camera') || app.findObjectByName('camera');
          if (camera) console.log('Found camera by name');
        }
        
        if (camera && camera.position) {
          const startZ = 1523;
          const endZ = -2020;
          const newZ = startZ + (endZ - startZ) * t;
          console.log('Setting camera Z from', camera.position.z, 'to', newZ);
          camera.position.z = newZ;
          
          // Force update if needed
          if (camera.updateMatrixWorld) camera.updateMatrixWorld(true);
        } else {
          console.log('Camera not found or no position property');
          console.log('Available app properties:', Object.keys(app));
        }
      } catch (e) {
        console.log('Camera animation failed:', e);
      }
    };
    const step = (delta: number) => {
      const next = Math.max(0, Math.min(1, progressRef.current + delta));
      console.log('Step - current:', progressRef.current, 'delta:', delta, 'next:', next);
      if (next !== progressRef.current) {
        progressRef.current = next;
        deltaRef.current = delta; // Store delta direction
        if (rafRef.current == null) {
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            animateCamera(progressRef.current);
            // Dismiss when scrolling forward reaches near the end (more forgiving)
            if (progressRef.current >= 0.98 && deltaRef.current > 0) {
              // Start fade transition
              setActive(false);
              // Force unlock scroll immediately to prevent getting stuck
              setTimeout(() => {
                document.documentElement.classList.remove("body-locked");
                document.body.classList.remove("body-locked");
                // Double-check unlock after transition
                setTimeout(() => {
                  document.documentElement.classList.remove("body-locked");
                  document.body.classList.remove("body-locked");
                }, 400);
              }, 350);
            }
          });
        }
      }
    };
    const onWheel = (e: WheelEvent) => { 
      e.preventDefault(); 
      const delta = e.deltaY * 0.002;
      console.log('Wheel deltaY:', e.deltaY, 'mapped delta:', delta, 'current progress:', progressRef.current);
      step(delta); 
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      step(dy * 0.004);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
    };
  }, [active]);

  // Failsafe: force dismiss overlay and unlock scroll if stuck
  useEffect(() => {
    const checkAndFix = () => {
      // If progress is at 1 but overlay is still active, force dismiss
      if (progressRef.current >= 0.98 && active) {
        console.log("Failsafe: Force dismissing stuck overlay at progress", progressRef.current);
        setActive(false);
      }
      
      // If overlay is inactive but scroll is still locked, unlock it
      if (!active && (document.documentElement.classList.contains("body-locked") || document.body.classList.contains("body-locked"))) {
        console.log("Failsafe: Unlocking stuck scroll");
        document.documentElement.classList.remove("body-locked");
        document.body.classList.remove("body-locked");
      }
    };
    
    const interval = setInterval(checkAndFix, 500); // Check twice per second
    return () => clearInterval(interval);
  }, [active]);

  const handleSkip = () => {
    setActive(false);
    document.body.classList.remove('overlay-loading');
    // Force unlock scroll immediately
    document.documentElement.classList.remove("body-locked");
    document.body.classList.remove("body-locked");
  };

  return (
    <div
      id="spline-overlay"
      className={`fixed inset-0 z-[999] transition-opacity duration-700 ease-in-out ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <Spline
        scene={`https://prod.spline.design/yEhXdeYqw0-tnrZy/scene.splinecode?v=${Date.now()}`}
        onLoad={(app) => { 
          appRef.current = app; 
          setSplineLoaded(true);
          console.log('Spline loaded successfully');
        }}
        style={{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: "none" }}
      />
      
      {/* Skip button - always visible when overlay is active */}
      {active && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Skip animation"
        >
          Skip →
        </button>
      )}
      
      {/* Loading screen with gradient background */}
      {!splineLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #1828CA 0%, #030A48 100%)'
          }}
        >
          
          {/* Loading content */}
          <div className="relative z-10 text-center">
            <div className="mb-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
            <div className="text-white text-xl font-medium">Loading Experience...</div>
            <div className="text-white/80 text-sm mt-2">Preparing your journey</div>
          </div>
        </div>
      )}
    </div>
  );
}
