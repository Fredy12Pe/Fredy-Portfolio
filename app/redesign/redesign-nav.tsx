"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { ROUTES, isAboutPath, isContactPath } from "./routes";

const FADE_MS = 320;

type BreathingCtx = {
  breathingActive: boolean;
  setBreathingActive: (active: boolean) => void;
};

type PageFadeCtx = {
  fadeTo: (href: string) => void;
  contentVisible: boolean;
  onFadeOutComplete: () => void;
};

const BreathingContext = createContext<BreathingCtx | null>(null);
const PageFadeContext = createContext<PageFadeCtx | null>(null);

export function useBreathingSession() {
  const ctx = useContext(BreathingContext);
  if (!ctx) {
    throw new Error("useBreathingSession must be used within RedesignProviders");
  }
  return ctx;
}

export function usePageFade() {
  const ctx = useContext(PageFadeContext);
  if (!ctx) {
    throw new Error("usePageFade must be used within RedesignProviders");
  }
  return ctx;
}

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export function RedesignProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? ROUTES.home;
  const router = useRouter();
  const reduced = useReducedMotion();
  const [breathingActive, setBreathingActive] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    if (isAboutPath(pathname) || isContactPath(pathname)) {
      setBreathingActive(false);
    }
  }, [pathname]);

  useEffect(() => {
    setContentVisible(true);
  }, [pathname]);

  const fadeTo = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.origin);
      const targetPath = normalizePath(url.pathname);
      const currentPath = normalizePath(pathname);

      if (targetPath === currentPath) {
        if (url.hash) {
          window.location.hash = url.hash;
        } else if (targetPath === ROUTES.home) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          history.replaceState(null, "", targetPath);
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        }
        return;
      }

      if (reduced) {
        router.push(href);
        return;
      }

      pendingHref.current = href;
      setContentVisible(false);
    },
    [pathname, reduced, router],
  );

  const onFadeOutComplete = useCallback(() => {
    if (contentVisible || !pendingHref.current) return;
    const href = pendingHref.current;
    pendingHref.current = null;
    const url = new URL(href, window.location.origin);
    if (!url.hash) {
      window.scrollTo(0, 0);
    }
    router.push(href);
  }, [contentVisible, router]);

  return (
    <BreathingContext.Provider value={{ breathingActive, setBreathingActive }}>
      <PageFadeContext.Provider
        value={{ fadeTo, contentVisible, onFadeOutComplete }}
      >
        {children}
      </PageFadeContext.Provider>
    </BreathingContext.Provider>
  );
}

export { FADE_MS };
