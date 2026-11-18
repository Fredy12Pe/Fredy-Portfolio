"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** An mp4/webm/mov plays as footage; any other path is treated as a still image that drifts slowly */
  src: string;
  /** Characters from darkest to brightest */
  charSet?: string;
  contrast?: number;
  /** Levels: brightness at or below blackPoint draws nothing; at whitePoint it is full (0–1) */
  blackPoint?: number;
  whitePoint?: number;
  /** Treats dark as bright, for a dark subject on a light background */
  invert?: boolean;
  /** Stretches each frame's own darkest-to-brightest range to 0–1 first, for flat, low-contrast footage */
  autoLevels?: boolean;
  /**
   * What counts as bright. "luma": plain brightness. "warm": red/orange areas are the subject and their
   * brightness gives the shading, for a warm subject (a poppy, a flame) on a cool or green background.
   */
  mode?: "luma" | "warm";
  /** Moves the picture sideways, as a fraction of the box width (0.2 = a fifth to the right) */
  shiftX?: number;
  /** Columns of characters; rows follow the box's aspect ratio */
  columns?: number;
  background?: string;
  /** Text colour as "r,g,b"; brightness sets each character's opacity */
  color?: string;
  /** Radius, in cells, of the glow that follows the pointer (0 turns it off) */
  pointerRadius?: number;
  /** "ascii": characters. "dither": an ordered-dither halftone of square dots, like a 1-bit print */
  look?: "ascii" | "dither";
  /** Dither only: dot size as a fraction of its cell (1 = dots touch) */
  dotSize?: number;
  /** How the picture fills the box: crop to fill it, or fit inside it */
  fit?: "cover" | "contain";
  /** Still images only: slow zoom and drift so the picture feels alive */
  drift?: boolean;
  className?: string;
};

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// One pass: for every pixel, find its cell, sample the video at the cell's centre, turn that into a
// character index and read the character's shape from the glyph atlas.
const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVideo;
uniform sampler2D uAtlas;
uniform vec2 uRes;        // canvas size, device px
uniform vec2 uCell;       // cell size, device px
uniform vec2 uGrid;       // columns, rows
uniform vec4 uCrop;       // x, y, w, h of the visible part of the source, 0-1
uniform float uShift;     // sideways shift, in cells
uniform vec2 uLevels;     // auto-levels low, high
uniform vec2 uBW;         // black point, white point
uniform float uContrast;
uniform float uInvert;
uniform float uWarm;
uniform vec4 uPointer;    // x, y (device px, top-down), radius (device px), lift 0-1
uniform vec3 uColor;
uniform vec3 uBg;
uniform float uCount;     // characters in the atlas
uniform float uDither;    // 1: ordered-dither halftone of square dots instead of characters
uniform float uDot;       // dot size as a fraction of its cell (dither)
out vec4 outColor;

float value(vec3 c) {
  float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
  if (uWarm < 0.5) return luma;
  float warmth = max(0.0, c.r - max(c.g, c.b));
  return smoothstep(0.08, 0.25, warmth) * luma;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 cell = floor(p / uCell);
  vec2 local = fract(p / uCell);
  float gx = cell.x - uShift;
  if (gx < 0.0 || gx >= uGrid.x) { outColor = vec4(uBg, 1.0); return; }
  vec2 uv = uCrop.xy + (vec2(gx, cell.y) + 0.5) / uGrid * uCrop.zw;
  // Outside the picture (contain fit) or where it is transparent: background
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { outColor = vec4(uBg, 1.0); return; }
  vec4 src = texture(uVideo, uv);
  if (src.a < 0.5) { outColor = vec4(uBg, 1.0); return; }
  float b = value(src.rgb);
  b = (b - uLevels.x) / max(uLevels.y - uLevels.x, 0.001);
  if (uInvert > 0.5) b = 1.0 - b;
  b = (b - uBW.x) / max(uBW.y - uBW.x, 0.001);
  b = clamp((b - 0.5) * uContrast + 0.5, 0.0, 1.0);
  if (uPointer.w > 0.0 && uPointer.z > 0.0) {
    vec2 centre = (cell + 0.5) * uCell;
    float d = distance(centre, uPointer.xy) / uPointer.z;
    if (d < 1.0) b = min(1.0, b + (1.0 - d * d) * 0.6 * uPointer.w);
  }
  if (uDither > 0.5) {
    // 4x4 Bayer matrix: each cell is on when its brightness beats its threshold
    ivec2 q = ivec2(mod(cell, 4.0));
    int i = q.x + q.y * 4;
    float m[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
    float threshold = (m[i] + 0.5) / 16.0;
    vec2 edge = abs(local - 0.5);
    bool inDot = max(edge.x, edge.y) < uDot * 0.5;
    outColor = vec4(b > threshold && inDot ? uColor : uBg, 1.0);
    return;
  }
  float k = floor(b * (uCount - 1.0) + 0.5);
  if (k < 1.0) { outColor = vec4(uBg, 1.0); return; }
  float glyph = texture(uAtlas, vec2((k + local.x) / uCount, local.y)).a;
  float a = glyph * (0.15 + 0.85 * k / (uCount - 1.0));
  outColor = vec4(mix(uBg, uColor, a), 1.0);
}`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Plays a muted video and draws each frame as ASCII characters, on the GPU, so even a very fine grid
 * runs at full frame rate. Based on the Framer "ASCII Video Effect" component, tinted to one colour,
 * sized to its box, with a soft lift around the pointer.
 */
export default function AsciiVideo({
  src,
  charSet = " .,:;-~=+<>i!lI?/|)(1}{][rcvunxzjftLCJUYXZO0Qoahkbdpqwm*#MW&8%B@$",
  contrast = 1,
  blackPoint = 0.28,
  whitePoint = 0.65,
  invert = false,
  autoLevels = false,
  mode = "luma",
  shiftX = 0,
  columns = 480,
  background = "#15333f",
  color = "143,211,220",
  pointerRadius = 10,
  look = "ascii",
  dotSize = 0.82,
  fit = "cover",
  drift = true,
  className,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!box || !canvas || !video) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;

    const img = new Image();
    if (!isVideo) img.src = src;
    const chars = charSet.split("");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Program
    const compile = (type: number, code: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, code);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const u = (name: string) => gl.getUniformLocation(prog, name);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    // Glyph atlas: every character once, white on transparent, in one row
    const GW = 32;
    const GH = 52;
    const atlas = document.createElement("canvas");
    atlas.width = GW * chars.length;
    atlas.height = GH;
    const aCtx = atlas.getContext("2d")!;
    aCtx.font = `${GH * 0.9}px "Courier New", Courier, monospace`;
    aCtx.textAlign = "center";
    aCtx.textBaseline = "middle";
    aCtx.fillStyle = "#fff";
    chars.forEach((ch, k) => aCtx.fillText(ch, k * GW + GW / 2, GH / 2));
    const atlasTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, atlasTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const videoTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.uniform1i(u("uVideo"), 0);
    gl.uniform1i(u("uAtlas"), 1);
    gl.uniform1f(u("uCount"), chars.length);
    gl.uniform3fv(u("uColor"), color.split(",").map((n) => Number(n) / 255));
    gl.uniform3fv(u("uBg"), hexToRgb(background));
    gl.uniform2f(u("uBW"), blackPoint, whitePoint);
    gl.uniform1f(u("uContrast"), contrast);
    gl.uniform1f(u("uInvert"), invert ? 1 : 0);
    gl.uniform1f(u("uWarm"), mode === "warm" ? 1 : 0);
    gl.uniform1f(u("uDither"), look === "dither" ? 1 : 0);
    gl.uniform1f(u("uDot"), dotSize);

    // Sizing
    let dpr = 1;
    let cols = columns;
    let rows = 1;
    let cellW = 1;
    let cellH = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = box.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      cols = width < 640 ? Math.round(columns * 0.5) : columns;
      cellW = canvas.width / cols;
      cellH = look === "dither" ? cellW : cellW * 1.6;
      rows = Math.max(1, Math.ceil(canvas.height / cellH));
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform2f(u("uCell"), cellW, cellH);
      gl.uniform2f(u("uGrid"), cols, rows);
      gl.uniform1f(u("uShift"), Math.round(shiftX * cols));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    // Auto-levels read a tiny copy of the frame on the CPU every few frames
    const probe = document.createElement("canvas");
    probe.width = 96;
    probe.height = 54;
    const pCtx = probe.getContext("2d", { willReadFrequently: true });
    const levels = { lo: 0, hi: 1 };
    const measure = (media: CanvasImageSource) => {
      if (!pCtx) return;
      pCtx.drawImage(media, 0, 0, probe.width, probe.height);
      const d = pCtx.getImageData(0, 0, probe.width, probe.height).data;
      const hist = new Uint32Array(256);
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 128) continue;
        const r = d[i] / 255;
        const g = d[i + 1] / 255;
        const bl = d[i + 2] / 255;
        let v = 0.2126 * r + 0.7152 * g + 0.0722 * bl;
        if (mode === "warm") {
          const w = Math.max(0, r - Math.max(g, bl));
          const t = Math.min(1, Math.max(0, (w - 0.08) / 0.17));
          v *= t * t * (3 - 2 * t);
        }
        hist[(v * 255) | 0]++;
      }
      // Warm mode measures only the subject; the empty background would pull the low end to 0
      let n = 0;
      for (let v = mode === "warm" ? 1 : 0; v < 256; v++) n += hist[v];
      let acc = 0;
      let lo = 0;
      let hi = 255;
      for (let v = mode === "warm" ? 1 : 0; v < 256; v++) {
        acc += hist[v];
        if (acc <= n * 0.03) lo = v;
        if (acc <= n * 0.97) hi = v;
      }
      if (mode === "warm") lo = 0;
      levels.lo += (lo / 255 - levels.lo) * 0.2;
      levels.hi += (Math.max(hi, lo + 8) / 255 - levels.hi) * 0.2;
    };

    const pointer = { x: 0, y: 0, lift: 0 };
    let raf = 0;
    let frame = 0;
    let visible = true;

    const draw = () => {
      const ready = isVideo ? video.readyState >= 2 && video.videoWidth > 0 : img.complete && img.naturalWidth > 0;
      if (ready) {
        const media = isVideo ? video : img;
        const mw = isVideo ? video.videoWidth : img.naturalWidth;
        const mh = isVideo ? video.videoHeight : img.naturalHeight;
        // Cover-fit the source into the grid; a still image also zooms and drifts slowly
        const t = performance.now() / 1000;
        const moving = !isVideo && drift;
        const zoom = moving ? 1.12 + Math.sin(t * 0.15) * 0.05 : 1;
        const gr = (cols * cellW) / (rows * cellH);
        let cw = 1;
        let ch = 1;
        const wider = mw / mh > gr;
        if (fit === "contain") {
          // A crop bigger than 1 leaves empty space around the picture
          if (wider) ch = mw / gr / mh;
          else cw = (mh * gr) / mw;
        } else if (wider) cw = (mh * gr) / mw;
        else ch = mw / gr / mh;
        cw /= zoom;
        ch /= zoom;
        const dx = moving ? Math.sin(t * 0.11) * (1 - cw) * 0.5 : 0;
        const dy = moving ? Math.cos(t * 0.09) * (1 - ch) * 0.5 : 0;
        gl.uniform4f(u("uCrop"), (1 - cw) / 2 + dx, (1 - ch) / 2 + dy, cw, ch);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, videoTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media);

        if (autoLevels && frame % 6 === 0) measure(media);
        gl.uniform2f(u("uLevels"), autoLevels ? levels.lo : 0, autoLevels ? levels.hi : 1);
        gl.uniform4f(u("uPointer"), pointer.x * dpr, pointer.y * dpr, pointerRadius * cellW, pointer.lift);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        frame++;
      }
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    if (isVideo) {
      video.addEventListener("loadeddata", start);
      if (reduced) video.pause();
      else video.play().catch(() => {});
    } else {
      img.onload = start;
    }
    start();

    // Stop drawing while scrolled away
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced) {
        if (isVideo) video.play().catch(() => {});
        start();
      } else if (isVideo) {
        video.pause();
      }
    });
    io.observe(box);

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.lift = 1;
    };
    const onLeave = () => {
      pointer.lift = 0;
    };
    const host = box.parentElement ?? box;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      video.removeEventListener("loadeddata", start);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(videoTex);
      gl.deleteTexture(atlasTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [src, isVideo, charSet, contrast, blackPoint, whitePoint, invert, autoLevels, mode, shiftX, columns, background, color, pointerRadius, look, dotSize, fit, drift]);

  return (
    <div ref={boxRef} className={className} style={{ background, overflow: "hidden" }} aria-hidden>
      <video
        ref={videoRef}
        src={isVideo ? src : undefined}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
