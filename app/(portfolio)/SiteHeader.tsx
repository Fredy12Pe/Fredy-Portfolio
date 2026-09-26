"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { memo, useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import styles from "./SiteHeader.module.css";

const interBlack = Inter({
  weight: "900",
  subsets: ["latin"],
  display: "swap",
});

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Works" },
  { href: "/#about", label: "About Me" },
  { href: "/#contact", label: "Contact" },
] as const;

function onSamePageHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (window.location.pathname !== "/") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let y = 0;

  if (href === "/") {
    y = 0;
  } else if (href.startsWith("/#")) {
    const target = document.getElementById(href.slice(2));
    if (!target) return;
    const offset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    y = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
  } else {
    return;
  }

  event.preventDefault();
  const distance = Math.abs(y - window.scrollY);
  if (distance < 2) {
    window.history.pushState(null, "", href);
    return;
  }

  const root = document.documentElement;
  const restore = () => {
    root.style.scrollBehavior = "";
  };
  // Native smooth scrolling fights the pinned sections and lands in a jump.
  root.style.scrollBehavior = "auto";
  gsap.to(window, {
    duration: reduced ? 0 : gsap.utils.clamp(0.75, 1.35, distance / 1400),
    ease: "power2.inOut",
    scrollTo: { y, autoKill: true },
    overwrite: "auto",
    onInterrupt: restore,
    onComplete: () => {
      restore();
      window.history.pushState(null, "", href);
    },
  });
}

const TITLE_LINES = ["UI/UX", "DESIGNER"] as const;

gsap.registerPlugin(Draggable, ScrollToPlugin);

/** Produce stickers — Figma Header 89:648 (tilt lives on an inner layer so drag can own x/y). */
const LETTER_STICKERS = [
  {
    id: "h",
    src: "/images/portfolio-v3/stickers/h.png",
    width: 1047,
    height: 1563,
    className: styles.stickerH,
    rotate: 5.79,
  },
  {
    id: "a",
    src: "/images/portfolio-v3/stickers/a.png",
    width: 1310,
    height: 1431,
    className: styles.stickerA,
    rotate: 5.65,
  },
  {
    id: "p1",
    src: "/images/portfolio-v3/stickers/p1.png",
    width: 1070,
    height: 1386,
    className: styles.stickerP1,
    rotate: -4.73,
  },
  {
    id: "p2",
    src: "/images/portfolio-v3/stickers/p2.png",
    width: 1135,
    height: 1483,
    className: styles.stickerP2,
    rotate: 5.89,
  },
  {
    id: "y",
    src: "/images/portfolio-v3/stickers/y.png",
    width: 1247,
    height: 1411,
    className: styles.stickerY,
    rotate: -7.4,
  },
] as const;

type StickerProps = {
  className: string;
  src: string;
  width: number;
  height: number;
  priority?: boolean;
  rotate?: number;
  /** One sticker peels slightly after load, as a cue that the set can be moved. */
  hint?: boolean;
};

function SideSticker({ className, src, width, height, priority }: StickerProps) {
  return (
    <div className={className} data-enter-sticker>
      <Image
        className={styles.letterImg}
        src={src}
        alt=""
        width={width}
        height={height}
        priority={priority}
        unoptimized
      />
    </div>
  );
}

/**
 * Growing fold: --peel is a percent. The face clips back and the
 * pale underside flap grows to the same size.
 */
function LetterPeel({
  className,
  src,
  width,
  height,
  priority,
  rotate = 0,
  hint = false,
}: StickerProps) {
  return (
    <div
      className={`${styles.sticker} ${styles.letterPeel} ${className}`}
      data-letter-peel
      data-enter-sticker
      data-peel-hint={hint ? "true" : undefined}
      role="button"
      aria-label="Move sticker"
    >
      <div className={styles.peelTilt} style={{ rotate: `${rotate}deg` }}>
        <div className={styles.peelHop}>
          <div className={styles.peelMain}>
            <Image
              className={styles.peelFace}
              src={src}
              alt=""
              width={width}
              height={height}
              priority={priority}
              unoptimized
            />
          </div>
          <div className={styles.peelFlap} aria-hidden>
            <Image
              className={styles.peelFlapImg}
              src={src}
              alt=""
              width={width}
              height={height}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const QUAD_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FLOW_FRAG = `
precision highp float;
uniform sampler2D tMap;
uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uVelocity;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tMap, vUv);
  color.rgb *= uDissipation;
  vec2 cursor = vUv - uMouse;
  cursor.x *= uAspect;
  vec3 stamp = vec3(uVelocity * vec2(1.0, -1.0), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
  float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
  color.rgb = mix(color.rgb, stamp, vec3(falloff));
  // 8-bit targets round a fading trail back up, which leaves the letters shifted.
  color.rgb = max(color.rgb - vec3(1.0 / 255.0), 0.0);
  gl_FragColor = vec4(color.rgb, 1.0);
}
`;

const FLUID_FRAG = `
precision highp float;
uniform sampler2D uText;
uniform sampler2D uFlow;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 flow = texture2D(uFlow, uv).xy;
  flow *= smoothstep(0.0, 0.035, length(flow));
  float r = texture2D(uText, uv - flow * 0.32).a;
  float g = texture2D(uText, uv - flow * 0.26).a;
  float b = texture2D(uText, uv - flow * 0.20).a;
  float alpha = max(r, max(g, b));
  // Premultiplied: black fill + chromatic edges, transparent outside the glyphs.
  gl_FragColor = vec4((1.0 - r) * alpha, (1.0 - g) * alpha, (1.0 - b) * alpha, alpha);
}
`;


function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function makeProgram(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertex);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragment);
  if (!vert || !frag) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return null;
  }
  return { program, vert, frag };
}

const HeaderTitle = memo(function HeaderTitle({
  className,
}: {
  className: string;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    const canvas = canvasRef.current;
    if (!title || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Phones keep the type still. The fluid warp is a pointer effect.
    const compact = window.matchMedia("(max-width: 860px)");
    let cleanup = () => {};

    const stop = () => {
      cleanup();
      cleanup = () => {};
      delete title.dataset.warp;
    };

    const start = () => {
      stop();
      if (reduced.matches || compact.matches) return;
      cleanup = mountTitleWarp(title, canvas);
    };

    start();
    reduced.addEventListener("change", start);
    compact.addEventListener("change", start);
    return () => {
      reduced.removeEventListener("change", start);
      compact.removeEventListener("change", start);
      stop();
    };
  }, []);

  return (
    <h1 ref={titleRef} className={className} aria-label="UI/UX Designer">
      <span className={styles.titleVisual} aria-hidden>
        {TITLE_LINES.map((line) => (
          <span key={line} className={styles.titleLine} data-line>
            {line}
          </span>
        ))}
      </span>
      <canvas ref={canvasRef} className={styles.warpCanvas} aria-hidden />
    </h1>
  );
});

function mountTitleWarp(title: HTMLHeadingElement, canvas: HTMLCanvasElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) return () => {};

    const flow = makeProgram(gl, QUAD_VERT, FLOW_FRAG);
    const display = makeProgram(gl, QUAD_VERT, FLUID_FRAG);
    if (!flow || !display) return () => {};

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "aPos");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    const makeTarget = () => {
      const tex = gl.createTexture();
      const fb = gl.createFramebuffer();
      if (!tex || !fb) return null;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        128,
        128,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
      );
      gl.viewport(0, 0, 128, 128);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb };
    };

    const read = makeTarget();
    const write = makeTarget();
    if (!read || !write) return () => {};
    let flowRead = read;
    let flowWrite = write;

    const textTex = gl.createTexture();
    if (!textTex) return () => {};
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d", { alpha: true });
    if (!textCtx) return () => {};

    let aspect = 1;

    const flowLoc = {
      map: gl.getUniformLocation(flow.program, "tMap"),
      falloff: gl.getUniformLocation(flow.program, "uFalloff"),
      alpha: gl.getUniformLocation(flow.program, "uAlpha"),
      dissipation: gl.getUniformLocation(flow.program, "uDissipation"),
      aspect: gl.getUniformLocation(flow.program, "uAspect"),
      mouse: gl.getUniformLocation(flow.program, "uMouse"),
      velocity: gl.getUniformLocation(flow.program, "uVelocity"),
    };
    const viewLoc = {
      text: gl.getUniformLocation(display.program, "uText"),
      flow: gl.getUniformLocation(display.program, "uFlow"),
      resolution: gl.getUniformLocation(display.program, "uResolution"),
    };

    const paintText = () => {
      const lines = Array.from(title.querySelectorAll<HTMLElement>("[data-line]"));
      if (!lines.length) return;
      const style = getComputedStyle(title);
      const fontPx = parseFloat(style.fontSize) || 100;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pad = fontPx * 0.45;
      const rect = title.getBoundingClientRect();
      const cssW = Math.max(1, rect.width + pad * 2);
      const cssH = Math.max(1, rect.height + pad * 2);
      const bufferW = Math.max(1, Math.round(cssW * dpr));
      const bufferH = Math.max(1, Math.round(cssH * dpr));

      canvas.style.left = `${-pad}px`;
      canvas.style.top = `${-pad}px`;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      if (canvas.width !== bufferW || canvas.height !== bufferH) {
        canvas.width = bufferW;
        canvas.height = bufferH;
      }
      aspect = cssW / cssH;

      textCanvas.width = bufferW;
      textCanvas.height = bufferH;
      textCtx.setTransform(1, 0, 0, 1, 0, 0);
      textCtx.clearRect(0, 0, bufferW, bufferH);
      textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      textCtx.font = style.font;
      textCtx.fillStyle = "#fff";
      textCtx.textAlign = "center";
      textCtx.textBaseline = "alphabetic";
      textCtx.letterSpacing = style.letterSpacing;

      const lineHeight = parseFloat(style.lineHeight) || fontPx * 0.92;
      const halfLeading = (lineHeight - fontPx) / 2;
      const ascent = textCtx.measureText("Hg").fontBoundingBoxAscent || fontPx * 0.8;
      lines.forEach((line) => {
        const lineRect = line.getBoundingClientRect();
        const x = pad + (lineRect.left - rect.left) + lineRect.width / 2;
        const baseline = pad + (lineRect.top - rect.top) + halfLeading + ascent;
        textCtx.fillText(line.textContent ?? "", x, baseline);
      });

      gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    };

    const mouse = { x: -1, y: -1 };
    const velocity = { x: 0, y: 0 };
    const flowVelocity = { x: 0, y: 0 };
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;
    let seen = false;
    let velocityNeedsUpdate = false;
    let idleMs = 0;
    let lastTick = performance.now();

    const clearFlow = () => {
      gl.clearColor(0, 0, 0, 0);
      for (const target of [flowRead, flowWrite]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
        gl.viewport(0, 0, 128, 128);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    };

    const onMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!inside) return;

      const now = performance.now();
      if (!seen) {
        seen = true;
        lastTime = now;
        lastX = event.clientX;
        lastY = event.clientY;
      } else {
        const delta = Math.max(10.4, now - lastTime);
        velocity.x = (event.clientX - lastX) / delta;
        velocity.y = (event.clientY - lastY) / delta;
        lastTime = now;
        lastX = event.clientX;
        lastY = event.clientY;
        velocityNeedsUpdate = true;
      }
      mouse.x = (event.clientX - bounds.left) / bounds.width;
      mouse.y = 1 - (event.clientY - bounds.top) / bounds.height;
    };

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(50, now - lastTick);
      lastTick = now;

      if (!velocityNeedsUpdate) {
        mouse.x = -1;
        mouse.y = -1;
        velocity.x = 0;
        velocity.y = 0;
        idleMs += dt;
      } else {
        idleMs = 0;
      }
      velocityNeedsUpdate = false;
      const moving = Math.hypot(velocity.x, velocity.y) > 0.02;
      const ease = moving ? 0.15 : 0.2;
      flowVelocity.x += (velocity.x - flowVelocity.x) * ease;
      flowVelocity.y += (velocity.y - flowVelocity.y) * ease;

      const settled =
        !moving && idleMs > 650 && Math.hypot(flowVelocity.x, flowVelocity.y) < 0.02;
      if (settled) {
        flowVelocity.x = 0;
        flowVelocity.y = 0;
        clearFlow();
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, flowWrite.fb);
        gl.viewport(0, 0, 128, 128);
        gl.useProgram(flow.program);
        bindQuad(flow.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, flowRead.tex);
        gl.uniform1i(flowLoc.map, 0);
        gl.uniform1f(flowLoc.falloff, 0.28);
        gl.uniform1f(flowLoc.alpha, 0.65);
        gl.uniform1f(flowLoc.dissipation, moving ? 0.92 : 0.86);
        gl.uniform1f(flowLoc.aspect, aspect);
        gl.uniform2f(flowLoc.mouse, mouse.x, mouse.y);
        gl.uniform2f(flowLoc.velocity, flowVelocity.x, flowVelocity.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        const previous = flowRead;
        flowRead = flowWrite;
        flowWrite = previous;
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(display.program);
      bindQuad(display.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, flowRead.tex);
      gl.uniform1i(viewLoc.text, 0);
      gl.uniform1i(viewLoc.flow, 1);
      gl.uniform2f(viewLoc.resolution, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    paintText();
    title.dataset.warp = "on";
    tick();
    window.addEventListener("pointermove", onMove);
    const resize = new ResizeObserver(() => paintText());
    resize.observe(title);
    document.fonts.ready.then(() => paintText()).catch(() => undefined);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      resize.disconnect();
      gsap.ticker.remove(tick);
      delete title.dataset.warp;
      gl.deleteTexture(textTex);
      gl.deleteTexture(read.tex);
      gl.deleteTexture(write.tex);
      gl.deleteFramebuffer(read.fb);
      gl.deleteFramebuffer(write.fb);
      gl.deleteBuffer(buffer);
      for (const program of [flow, display]) {
        gl.deleteProgram(program.program);
        gl.deleteShader(program.vert);
        gl.deleteShader(program.frag);
      }
    };
}


export default function SiteHeader() {
  const pathname = usePathname();
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useRef(false);
  const menuReady = useRef(false);
  const iconReady = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!menuReady.current) {
      menuReady.current = true;
      gsap.set(panel, { opacity: 0, y: -8, visibility: "hidden" });
      return;
    }

    const duration = reducedMotion.current ? 0 : 0.28;
    const open = menuOpen;

    if (open) {
      gsap.set(panel, { visibility: "visible", y: -8 });
      gsap.to(panel, {
        opacity: 1,
        y: 0,
        duration,
        ease: "power2.out",
        overwrite: true,
      });
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: -8,
        duration,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          gsap.set(panel, { visibility: "hidden" });
        },
      });
    }

    return () => {
      gsap.killTweensOf(panel);
    };
  }, [menuOpen]);

  // Three dots stretch into the two strokes of an X. Same idea as the
  // menu toggle: the center mark fades while the outer marks sweep across.
  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;
    const left = icon.querySelector<HTMLElement>("[data-dot='left']");
    const mid = icon.querySelector<HTMLElement>("[data-dot='mid']");
    const right = icon.querySelector<HTMLElement>("[data-dot='right']");
    if (!left || !mid || !right) return;

    const travel = icon.getBoundingClientRect().width * 0.4;
    gsap.set([left, mid, right], { transformOrigin: "50% 50%" });

    if (!iconReady.current) {
      iconReady.current = true;
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 0.55;
    const ease = "power2.inOut";

    if (menuOpen) {
      gsap.to(mid, {
        scale: 0,
        opacity: 0,
        duration: duration * 0.5,
        ease,
        overwrite: true,
      });
      gsap.to(left, {
        x: travel,
        rotation: 45,
        scaleX: 2.7,
        scaleY: 0.82,
        duration,
        ease,
        overwrite: true,
      });
      gsap.to(right, {
        x: -travel,
        rotation: -45,
        scaleX: 2.7,
        scaleY: 0.82,
        duration,
        ease,
        overwrite: true,
      });
    } else {
      gsap.to(mid, {
        scale: 1,
        opacity: 1,
        duration,
        ease,
        overwrite: true,
      });
      gsap.to([left, right], {
        x: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration,
        ease,
        overwrite: true,
      });
    }

    return () => {
      gsap.killTweensOf([left, mid, right]);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    function onPointer(event: MouseEvent) {
      const panel = panelRef.current;
      const target = event.target as Node | null;
      if (!panel || !target) return;
      if (panel.contains(target)) return;
      if ((target as Element).closest?.("[data-menu-trigger]")) return;
      setMenuOpen(false);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // The bar is black over light surfaces and white over dark ones.
  useEffect(() => {
    const nav = navRef.current;
    const panel = panelRef.current;
    if (!nav || !panel) return;

    const panelWrap = panel.parentElement;
    let tone: "dark" | "light" = "dark";
    let frame = 0;
    let tail = 0;
    let lastSample = 0;

    const parseColor = (value: string) => {
      const match = value.match(
        /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/,
      );
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: match[4] === undefined ? 1 : Number(match[4]),
      };
    };

    const luminance = (r: number, g: number, b: number) => {
      const channel = (value: number) => {
        const s = value / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const belongsToMenu = (el: Element) =>
      nav.contains(el) || Boolean(panelWrap?.contains(el));

    const luminanceBehind = (x: number, y: number) => {
      const stack = document.elementsFromPoint(x, y);
      for (const hit of stack) {
        if (belongsToMenu(hit)) continue;
        let node: Element | null = hit;
        while (node && node !== document.documentElement) {
          const style = getComputedStyle(node);
          const opacity = Number.parseFloat(style.opacity);
          const bg = parseColor(style.backgroundColor);
          if (bg && bg.a > 0.55 && opacity > 0.45) {
            return luminance(bg.r, bg.g, bg.b);
          }
          node = node.parentElement;
        }
      }
      return null;
    };

    const measure = () => {
      const rect = nav.getBoundingClientRect();
      const average = luminanceBehind(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      if (average == null) return;
      const next: "dark" | "light" =
        tone === "dark"
          ? average < 0.42
            ? "light"
            : "dark"
          : average > 0.58
            ? "dark"
            : "light";
      if (next === tone) return;
      tone = next;
      nav.dataset.tone = next;
    };

    // One sample per frame at most, and never inside the scroll handler.
    // A continuous loop here was stalling scroll on the pinned sections.
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const now = performance.now();
        if (now - lastSample < 140) return;
        lastSample = now;
        measure();
      });
    };

    const onScroll = () => {
      schedule();
      window.clearTimeout(tail);
      // Scrubbed section colors keep moving after the scroll event.
      tail = window.setTimeout(() => {
        lastSample = 0;
        measure();
      }, 900);
    };

    nav.dataset.tone = "dark";
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(tail);
    };
  }, []);

  // Bottom stickers — fold the top back (mirrored underside, gloss, shadow).
  useLayoutEffect(() => {
    const root = headerRef.current;
    if (!root) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const peels = root.querySelectorAll<HTMLElement>("[data-letter-peel]");
    const dragBounds =
      root.parentElement?.matches("[data-sticker-bounds]")
        ? root.parentElement
        : root;
    const cleanups: Array<() => void> = [];
    let stack = 20;
    const HOVER_PEEL = 46;
    const PRESS_PEEL = 62;

    peels.forEach((peel) => {
      let hovering = false;
      let pressed = false;
      let dragging = false;
      let moved = false;
      // After a drag, ignore hover until the pointer leaves and comes back.
      let suppress = false;
      const hopEl = peel.querySelector<HTMLElement>(`.${styles.peelHop}`);
      let intro: gsap.core.Timeline | null = null;
      let hop: gsap.core.Timeline | null = null;
      let peelTween: gsap.core.Tween | null = null;
      gsap.set(peel, { "--peel": 0 });

      const stopBounce = (immediate = false) => {
        hop?.kill();
        hop = null;
        if (!hopEl) return;
        if (immediate) {
          gsap.set(hopEl, { y: 0 });
          return;
        }
        gsap.to(hopEl, {
          y: 0,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const startBounce = () => {
        if (!hopEl || !hovering || pressed || dragging || suppress) return;
        hop?.kill();
        hop = gsap.timeline({ repeat: -1, repeatDelay: 0.28 });
        hop
          .to(hopEl, { y: -12, duration: 0.22, ease: "power2.out" })
          .to(hopEl, { y: 0, duration: 0.42, ease: "bounce.out" });
      };

      const go = (amount: number) => {
        const current = parseFloat(gsap.getProperty(peel, "--peel") as string) || 0;
        peelTween?.kill();
        peelTween = gsap.to(peel, {
          "--peel": amount,
          duration: Math.abs(current - amount) < 0.5 ? 0 : 0.9,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            peelTween = null;
            if (amount === 0) delete peel.dataset.peelActive;
            if (amount === HOVER_PEEL) startBounce();
          },
        });
      };

      // Same close as hovering off: the fold eases shut instead of snapping.
      const foldShut = () => {
        stopBounce();
        go(0);
      };

      const cancelIntro = () => {
        intro?.kill();
        intro = null;
      };

      // Front sticker folds a little once the entrance fade has settled,
      // then lays flat again. Hovering or grabbing cancels it.
      if (peel.dataset.peelHint === "true") {
        intro = gsap.timeline({ delay: 1.15 });
        intro
          .call(() => {
            peel.dataset.peelActive = "true";
          })
          .to(peel, { "--peel": 22, duration: 0.7, ease: "power2.inOut" })
          .to(
            peel,
            { "--peel": 0, duration: 0.8, ease: "power2.inOut" },
            "+=0.4",
          )
          .call(() => {
            delete peel.dataset.peelActive;
          });
      }

      const enter = () => {
        cancelIntro();
        hovering = true;
        if (suppress || moved) return;
        peel.dataset.peelActive = "true";
        stopBounce(true);
        go(pressed ? PRESS_PEEL : HOVER_PEEL);
      };

      const leave = () => {
        if (dragging) return;
        hovering = false;
        pressed = false;
        suppress = false;
        moved = false;
        foldShut();
      };

      const down = () => {
        cancelIntro();
        stopBounce(true);
        pressed = true;
        peel.dataset.peelActive = "true";
        go(PRESS_PEEL);
      };

      const up = () => {
        pressed = false;
        // Placing it plays the same fold-shut as hovering off.
        // A click with no move returns to the hover peel.
        if (moved || suppress) {
          foldShut();
          return;
        }
        go(hovering ? HOVER_PEEL : 0);
      };

      peel.addEventListener("pointerenter", enter);
      peel.addEventListener("pointerleave", leave);
      peel.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);

      const drag = Draggable.create(peel, {
        type: "x,y",
        bounds: dragBounds,
        minimumMovement: 3,
        onPress() {
          stack += 1;
          gsap.set(peel, { zIndex: stack });
          peel.dataset.lifted = "true";
          if (!reduced) {
            gsap.to(peel, {
              scale: 1.06,
              duration: 0.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        },
        onDragStart() {
          dragging = true;
          moved = true;
        },
        onRelease() {
          dragging = false;
          delete peel.dataset.lifted;
          const stillOver = peel.matches(":hover");
          hovering = stillOver;
          pressed = false;
          if (moved) {
            suppress = stillOver;
            moved = false;
            foldShut();
          } else if (!stillOver) {
            foldShut();
          }
          if (!reduced) {
            gsap.to(peel, {
              scale: 1,
              duration: 0.28,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        },
      })[0];

      cleanups.push(() => {
        peel.removeEventListener("pointerenter", enter);
        peel.removeEventListener("pointerleave", leave);
        peel.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
        drag.kill();
        intro?.kill();
        hop?.kill();
        gsap.killTweensOf(peel);
        if (hopEl) gsap.killTweensOf(hopEl);
        delete peel.dataset.peelActive;
        delete peel.dataset.lifted;
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useLayoutEffect(() => {
    const root = headerRef.current;
    if (!root) return;
    const stickers = root.querySelectorAll<HTMLElement>("[data-enter-sticker]");
    if (!stickers.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      stickers,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.85,
        ease: "power2.out",
        stagger: 0.06,
      },
    );

    return () => {
      gsap.killTweensOf(stickers);
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header} data-node-id="89:648">
      <div className={styles.grain} aria-hidden />

      <div className={styles.sideFrame} aria-hidden>
        <div className={styles.sideLeft}>
          <SideSticker
            className={styles.sideLeftImg}
            src="/images/portfolio-v3/stickers/side-left.png"
            width={821}
            height={1164}
            priority
          />
        </div>
        <div className={styles.sideRight}>
          <SideSticker
            className={styles.sideRightImg}
            src="/images/portfolio-v3/stickers/side-right.png"
            width={707}
            height={1036}
            priority
          />
        </div>
      </div>

      <nav ref={navRef} className={styles.nav} data-tone="dark" aria-label="Site">
        <Link className={styles.logo} href="/" aria-label="Fredy — Home">
          <Image
            className={styles.logoImg}
            src="/images/portfolio-v3/signature.svg"
            alt=""
            width={69}
            height={40}
            unoptimized
            priority
          />
        </Link>

        <button
          type="button"
          className={styles.menuBtn}
          data-menu-trigger
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span ref={iconRef} className={styles.menuDots}>
            <span className={styles.menuDot} data-dot="left" />
            <span className={styles.menuDot} data-dot="mid" />
            <span className={styles.menuDot} data-dot="right" />
          </span>
        </button>
      </nav>

      <div className={styles.menuPanelWrap}>
        <div
          ref={panelRef}
          id={menuId}
          className={styles.menuPanel}
          data-open={menuOpen}
        >
          {NAV_ITEMS.map((item) => {
            const current =
              item.href === "/"
                ? pathname === "/"
                : !item.href.startsWith("/#") &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                className={styles.menuLink}
                href={item.href}
                aria-current={current ? "page" : undefined}
                onClick={(event) => {
                  onSamePageHash(event, item.href);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <HeaderTitle className={`${styles.title} ${interBlack.className}`} />

      <div className={styles.letterStickers}>
        {LETTER_STICKERS.map((sticker) => (
          <LetterPeel
            key={sticker.id}
            className={sticker.className}
            src={sticker.src}
            width={sticker.width}
            height={sticker.height}
            rotate={sticker.rotate}
            hint={sticker.id === "y"}
            priority
          />
        ))}
      </div>
    </header>
  );
}
