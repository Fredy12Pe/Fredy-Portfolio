"use client";

import * as React from "react";

export type DepthParallaxSettings = {
  /** Max shift as a fraction of the image size (0–0.15). */
  strength: number;
  /** Depth value that stays still: 0 = background pinned, 1 = foreground pinned. */
  focus: number;
  /** 0 = follows the cursor instantly, 1 = slow drift. */
  smoothing: number;
  /** How much vertical cursor movement counts (0 = horizontal only). */
  vertical: number;
};

export const DEFAULT_DEPTH_PARALLAX_SETTINGS: DepthParallaxSettings = {
  strength: 0.05,
  focus: 0.5,
  smoothing: 0.5,
  vertical: 1,
};

type DepthParallaxProps = {
  /** Photo URL (same origin, e.g. from /public). */
  src: string;
  /** Grayscale depth map URL, same size as the photo: white = near, black = far. */
  depthSrc: string;
  alt: string;
  /** Frame width / height. Defaults to 16:9. */
  aspectRatio?: number;
  /** Show the sliders under the image. */
  showControls?: boolean;
  /** Cover the parent instead of keeping its own aspect ratio. The cursor is read from the whole window, so content on top doesn't block it. */
  fill?: boolean;
  /** Visible share of the photo (0–1). Defaults to 1 − strength, which is the smallest zoom the strength can move within. */
  zoom?: number;
  /** Liquid trail that bends the photo where the cursor moves, with a slight colour split. */
  liquid?: boolean;
  /** Slow idle drift while the pointer is away from the image, so the depth reads as motion. */
  drift?: boolean;
  /** On phones and tablets, tilting the device moves the photo, as the cursor does elsewhere. iOS asks for motion access on the first tap. */
  tilt?: boolean;
  /** Highest device pixel ratio the canvas renders at. Lower values cost far less on high-density screens. */
  maxPixelRatio?: number;
  /** Starting values; missing keys fall back to the defaults. */
  initialSettings?: Partial<DepthParallaxSettings>;
  className?: string;
};

// Touch screens draw the photo at this share of the screen's pixels at most. The picture is soft and
// sits under overlays, so the lost detail is not visible, but the saved fill rate keeps scrolling smooth.
const TOUCH_PIXEL_RATIO = 0.75;

const VERT_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    vUv.y = 1.0 - vUv.y; // image row 0 is at the top
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPhoto;
  uniform sampler2D uDepth;
  uniform sampler2D uFlow;     // liquid trail, 128×128
  uniform float uLiquid;       // 1 when the liquid trail is on
  uniform vec2 uOffset;   // cursor offset, -1..1 per axis
  uniform float uStrength;
  uniform float uFocus;
  uniform vec2 uScale;    // fraction of the image visible on each axis
  uniform vec2 uMaxShift; // largest shift in uv units (keeps edges covered)

  // Photo colour at a screen uv, including the depth shift
  vec3 photoAt(vec2 screenUv) {
    vec2 uv = (screenUv - 0.5) * uScale + 0.5;
    float depth = texture2D(uDepth, uv).r;
    float k = (depth - uFocus) * uStrength;
    vec2 shift = clamp(-uOffset * k, -uMaxShift, uMaxShift);
    return texture2D(uPhoto, clamp(uv + shift, 0.0, 1.0)).rgb;
  }

  void main() {
    vec3 color = photoAt(vUv);
    if (uLiquid > 0.5) {
      vec2 flow = texture2D(uFlow, vUv).xy;
      flow *= smoothstep(0.0, 0.035, length(flow));
      // Each channel bends a little differently, which gives the liquid edge
      color.r = photoAt(vUv - flow * 0.018).r;
      color.g = photoAt(vUv - flow * 0.014).g;
      color.b = photoAt(vUv - flow * 0.01).b;
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Advects the trail: fades last frame and stamps the cursor's velocity around the pointer
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
    vec3 stamp = vec3(uVelocity, 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
    float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
    color.rgb = mix(color.rgb, stamp, vec3(falloff));
    // 8-bit targets round a fading trail back up, so trim a little each frame
    color.rgb = max(color.rgb - vec3(1.0 / 255.0), 0.0);
    gl_FragColor = vec4(color.rgb, 1.0);
  }
`;

// Map the 0..1 smoothing value to a per-frame follow factor (0.5 down to ~0.008)
const followFactor = (smoothing: number) => Math.pow(0.5, 1 + smoothing * 6);

const SLIDERS: {
  key: keyof DepthParallaxSettings;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}[] = [
  { key: "strength", label: "Strength", min: 0, max: 0.15, step: 0.005, format: (v) => v.toFixed(3) },
  { key: "focus", label: "Focus depth", min: 0, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: "smoothing", label: "Smoothing", min: 0, max: 1, step: 0.01, format: (v) => `${Math.round(v * 100)}%` },
  { key: "vertical", label: "Vertical motion", min: 0, max: 1, step: 0.01, format: (v) => `${Math.round(v * 100)}%` },
];

export function DepthParallax({
  src,
  depthSrc,
  alt,
  aspectRatio = 16 / 9,
  showControls = true,
  fill = false,
  zoom,
  liquid = false,
  drift = false,
  tilt = false,
  maxPixelRatio = 2,
  initialSettings,
  className,
}: DepthParallaxProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const driftRef = React.useRef(drift);
  driftRef.current = drift;
  const [settings, setSettings] = React.useState<DepthParallaxSettings>(() => ({
    ...DEFAULT_DEPTH_PARALLAX_SETTINGS,
    ...initialSettings,
  }));
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");

  // The render loop reads settings from a ref so slider changes don't rebuild WebGL
  const settingsRef = React.useRef(settings);
  const relayoutRef = React.useRef<() => void>(() => {});
  // Wakes the render loop from outside the effect below (see the drift effect)
  const startRef = React.useRef<() => void>(() => {});
  React.useEffect(() => {
    settingsRef.current = settings;
    relayoutRef.current();
  }, [settings]);

  React.useEffect(() => {
    if (drift) startRef.current();
  }, [drift]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setStatus("error");
      return;
    }

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
      }
      return shader;
    };
    const link = (fragSource: string) => {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSource));
      gl.linkProgram(prog);
      return prog;
    };

    const program = link(FRAG_SRC);
    gl.useProgram(program);

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const bindQuad = (prog: WebGLProgram) => {
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };
    bindQuad(program);

    const u = {
      photo: gl.getUniformLocation(program, "uPhoto"),
      depth: gl.getUniformLocation(program, "uDepth"),
      flow: gl.getUniformLocation(program, "uFlow"),
      liquid: gl.getUniformLocation(program, "uLiquid"),
      offset: gl.getUniformLocation(program, "uOffset"),
      strength: gl.getUniformLocation(program, "uStrength"),
      focus: gl.getUniformLocation(program, "uFocus"),
      scale: gl.getUniformLocation(program, "uScale"),
      maxShift: gl.getUniformLocation(program, "uMaxShift"),
    };
    gl.uniform1i(u.photo, 0);
    gl.uniform1i(u.depth, 1);
    gl.uniform1i(u.flow, 3);
    gl.uniform1f(u.liquid, 0);

    // A finger has no hover to leave a trail, so touch screens skip the liquid pass. They also draw the photo
    // at a lower resolution and a little less often, which keeps scrolling smooth on a phone or tablet GPU.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const useLiquid = liquid && !coarse;

    // Liquid trail: two 128×128 targets that ping-pong each frame
    const flowProgram = useLiquid ? link(FLOW_FRAG) : null;
    const flowLoc = flowProgram
      ? {
          map: gl.getUniformLocation(flowProgram, "tMap"),
          falloff: gl.getUniformLocation(flowProgram, "uFalloff"),
          alpha: gl.getUniformLocation(flowProgram, "uAlpha"),
          dissipation: gl.getUniformLocation(flowProgram, "uDissipation"),
          aspect: gl.getUniformLocation(flowProgram, "uAspect"),
          mouse: gl.getUniformLocation(flowProgram, "uMouse"),
          velocity: gl.getUniformLocation(flowProgram, "uVelocity"),
        }
      : null;
    const flowTargets: { tex: WebGLTexture; fb: WebGLFramebuffer }[] = [];
    if (flowProgram) {
      for (let i = 0; i < 2; i++) {
        const tex = gl.createTexture()!;
        const fb = gl.createFramebuffer()!;
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 128, 128, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        gl.viewport(0, 0, 128, 128);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        flowTargets.push({ tex, fb });
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    let flowRead = flowTargets[0];
    let flowWrite = flowTargets[1];

    let disposed = false;
    let ready = false;
    let imgAspect = aspectRatio;
    let raf = 0;
    let visible = true;
    let lastDrawAt = 0;
    let drawnOnce = false;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let inside = false;
    // While the device keeps reporting a tilt, the photo follows it instead of the idle drift. It goes back
    // to drifting when the reports stop for a moment, such as when the device is laid flat and still.
    let tiltAt = -Infinity;
    const isTilting = () => performance.now() - tiltAt < 1500;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Liquid pointer state, in the trail's 0..1 space (top-left origin)
    const mouse = { x: -1, y: -1 };
    const velocity = { x: 0, y: 0 };
    const flowVelocity = { x: 0, y: 0 };
    const last = { time: 0, x: 0, y: 0, seen: false };
    let velocityNeedsUpdate = false;
    let idleMs = 0;
    let lastTick = performance.now();

    const textures: WebGLTexture[] = [];
    const loadTexture = (unit: number, url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (disposed) return;
          const tex = gl.createTexture()!;
          textures.push(tex);
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          resolve(img);
        };
        img.onerror = () => reject(new Error(`Could not load ${url}`));
        img.src = url;
      });

    const layout = () => {
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio, coarse ? TOUCH_PIXEL_RATIO : Infinity);
      const rect = canvas.getBoundingClientRect();
      // Hidden (display: none, as when the About section covers the header) reports no size. The canvas
      // keeps its buffer, so showing it again costs no reallocation.
      if (rect.width === 0 || rect.height === 0) return;
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);

      // Cover-fit the image into the frame, then zoom in just enough
      // that the largest shift never reveals an edge
      const frameAspect = w / h;
      let sx = 1;
      let sy = 1;
      if (frameAspect > imgAspect) sy = imgAspect / frameAspect;
      else sx = frameAspect / imgAspect;
      const { strength, focus } = settingsRef.current;
      const visibleShare = zoom ?? 1 - strength;
      sx *= visibleShare;
      sy *= visibleShare;
      gl.uniform2f(u.scale, sx, sy);
      gl.uniform2f(u.maxShift, ((1 - sx) / 2) * 0.98, ((1 - sy) / 2) * 0.98);
      gl.uniform1f(u.strength, strength);
      gl.uniform1f(u.focus, focus);
    };
    relayoutRef.current = layout;

    const advectFlow = (aspect: number) => {
      if (!flowProgram || !flowLoc) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, flowWrite.fb);
      gl.viewport(0, 0, 128, 128);
      gl.useProgram(flowProgram);
      bindQuad(flowProgram);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, flowRead.tex);
      gl.uniform1i(flowLoc.map, 4);
      gl.uniform1f(flowLoc.falloff, 0.28);
      gl.uniform1f(flowLoc.alpha, 0.4);
      gl.uniform1f(flowLoc.dissipation, idleMs > 0 ? 0.86 : 0.92);
      gl.uniform1f(flowLoc.aspect, aspect);
      gl.uniform2f(flowLoc.mouse, mouse.x, mouse.y);
      gl.uniform2f(flowLoc.velocity, flowVelocity.x, flowVelocity.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const previous = flowRead;
      flowRead = flowWrite;
      flowWrite = previous;

      // Back to the photo pass, with the trail bound for sampling
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      bindQuad(program);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, flowRead.tex);
      gl.uniform1f(u.liquid, 1);
    };

    const frame = () => {
      raf = 0;
      if (disposed || !visible) return;
      // The idle drift is very slow, so it only needs about 30 frames a second. It also
      // holds still while the page is scrolling: the wander is lost in the scroll anyway,
      // and a photo that stops changing lets anything frosted on top of it keep its blur.
      const pacing = performance.now();
      const idleDrift = driftRef.current && !inside;
      const scrolling = document.documentElement.hasAttribute("data-scrolling");
      // The first picture is always drawn. Without it the photo stayed blank until the
      // pointer moved, because the holds below could skip every frame at page load.
      if (drawnOnce && (scrolling || (idleDrift && pacing - lastDrawAt < (coarse ? 50 : 33)))) {
        raf = requestAnimationFrame(frame);
        return;
      }
      drawnOnce = true;
      lastDrawAt = pacing;
      const { smoothing, vertical } = settingsRef.current;
      const f = followFactor(smoothing);
      // Idle drift: a slow, small wander while the pointer isn't over the image
      if (driftRef.current && !inside && !reducedMotion && !isTilting()) {
        const t = performance.now() / 1000;
        target.x = Math.sin(t * 0.35) * 0.3;
        target.y = Math.cos(t * 0.25) * 0.2;
      }
      current.x += (target.x - current.x) * f;
      current.y += (target.y * vertical - current.y) * f;

      // Trail input: velocity only counts on frames that got a pointer move
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
      flowVelocity.x += (velocity.x - flowVelocity.x) * 0.15;
      flowVelocity.y += (velocity.y - flowVelocity.y) * 0.15;

      gl.uniform2f(u.offset, current.x, current.y);
      if (flowProgram && liquid) advectFlow(canvas.width / canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Keep going only while something is still moving. Once the photo has settled and
      // the pointer has left, the loop stops instead of redrawing the same frame forever;
      // the pointer handlers call start() again when there is something new to show.
      const settled =
        Math.abs(target.x - current.x) < 0.0005 &&
        Math.abs(target.y * vertical - current.y) < 0.0005 &&
        Math.abs(flowVelocity.x) < 0.0005 &&
        Math.abs(flowVelocity.y) < 0.0005;
      const stillAnimating = (driftRef.current && !reducedMotion) || inside || isTilting() || !settled;
      if (stillAnimating) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && ready && visible && !disposed) raf = requestAnimationFrame(frame);
    };
    startRef.current = start;

    Promise.all([loadTexture(0, src), loadTexture(1, depthSrc)])
      .then(([photo]) => {
        if (disposed) return;
        imgAspect = photo.naturalWidth / photo.naturalHeight;
        ready = true;
        layout();
        setStatus("ready");
        start();
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    // Only the image reacts to the pointer, so using the sliders doesn't move it.
    // A filled background sits under other content, so it listens on the window instead.
    const moveTarget: EventTarget = fill ? window : canvas;
    const leaveTarget: EventTarget = fill ? document.documentElement : canvas;
    const leaveType = fill ? "mouseleave" : "pointerleave";
    const onPointerMove = (e: Event) => {
      if (reducedMotion) return;
      // A finger on the screen is scrolling, not pointing, while the tilt is steering the photo
      if (isTilting() && (e as PointerEvent).pointerType === "touch") return;
      const { clientX, clientY } = e as PointerEvent;
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      target.x = Math.max(-1, Math.min(1, x * 2 - 1));
      target.y = Math.max(-1, Math.min(1, y * 2 - 1));
      // The loop parks once the photo settles, so a move has to wake it or the photo
      // waits for an unrelated event (the visibility observer) before it responds.
      start();

      inside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      if (!inside || !useLiquid) return;

      const time = performance.now();
      if (!last.seen) {
        last.seen = true;
      } else {
        const delta = Math.max(10.4, time - last.time);
        velocity.x = (clientX - last.x) / delta;
        velocity.y = (clientY - last.y) / delta;
        velocityNeedsUpdate = true;
      }
      last.time = time;
      last.x = clientX;
      last.y = clientY;
      mouse.x = x;
      mouse.y = y;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
      inside = false;
      last.seen = false;
    };
    moveTarget.addEventListener("pointermove", onPointerMove);
    leaveTarget.addEventListener(leaveType, onPointerLeave);

    // Device tilt (phones and tablets). The first reading is taken as "level", and that level follows the
    // device slowly, so how it is held does not matter, only how it is tilted from there.
    const TILT_RANGE = 22;
    const level = { x: 0, y: 0, set: false };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (reducedMotion || e.beta == null || e.gamma == null) return;
      // gamma and beta are tilts about the device's own axes, so they swap places when it is turned sideways
      const angle = ((screen.orientation?.angle ?? 0) + 360) % 360;
      let x = e.gamma;
      let y = e.beta;
      if (angle === 90) {
        x = e.beta;
        y = -e.gamma;
      } else if (angle === 270) {
        x = -e.beta;
        y = e.gamma;
      } else if (angle === 180) {
        x = -e.gamma;
        y = -e.beta;
      }
      if (!level.set) {
        level.x = x;
        level.y = y;
        level.set = true;
      }
      level.x += (x - level.x) * 0.004;
      level.y += (y - level.y) * 0.004;
      target.x = Math.max(-1, Math.min(1, (x - level.x) / TILT_RANGE));
      target.y = Math.max(-1, Math.min(1, (y - level.y) / TILT_RANGE));
      tiltAt = performance.now();
      start();
    };
    // The page never asks for motion access: it listens, and the photo follows the tilt wherever the browser
    // reports it without asking (Android). Where the browser withholds it until the person allows it (iOS),
    // no reports arrive and the photo keeps its slow drift instead.
    if (tilt && typeof DeviceOrientationEvent !== "undefined" && coarse) {
      window.addEventListener("deviceorientation", onTilt);
    }

    const resizeObserver = new ResizeObserver(() => layout());
    resizeObserver.observe(canvas);

    // Stop rendering while the frame is off-screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    intersectionObserver.observe(canvas);

    return () => {
      disposed = true;
      relayoutRef.current = () => {};
      startRef.current = () => {};
      cancelAnimationFrame(raf);
      moveTarget.removeEventListener("pointermove", onPointerMove);
      leaveTarget.removeEventListener(leaveType, onPointerLeave);
      window.removeEventListener("deviceorientation", onTilt);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      textures.forEach((t) => gl.deleteTexture(t));
      flowTargets.forEach((t) => {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fb);
      });
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      if (flowProgram) gl.deleteProgram(flowProgram);
    };
  }, [src, depthSrc, aspectRatio, fill, zoom, liquid, tilt]);

  return (
    <figure className={className}>
      <div
        className={fill ? "h-full w-full overflow-hidden bg-black" : "relative w-full overflow-hidden bg-black"}
        style={fill ? undefined : { aspectRatio }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          className={`block h-full w-full transition-opacity duration-500 ${
            status === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
        {status === "error" && (
          <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-neutral-400">
            This effect needs WebGL, which isn&apos;t available here.
          </p>
        )}
      </div>

      {showControls && (
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {SLIDERS.map(({ key, label, min, max, step, format }) => (
            <label key={key} className="block">
              <span className="mb-1.5 flex justify-between text-xs tracking-wide text-neutral-400">
                {label}
                <output className="tabular-nums text-neutral-200">{format(settings[key])}</output>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={settings[key]}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, [key]: parseFloat(e.target.value) }))
                }
                className="w-full accent-[#7fc4cf]"
              />
            </label>
          ))}
          <div className="flex justify-center sm:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={() => setSettings({ ...DEFAULT_DEPTH_PARALLAX_SETTINGS, ...initialSettings })}
              className="rounded-md border border-white/15 px-3.5 py-1.5 text-xs text-neutral-400 transition hover:border-white/40 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </figure>
  );
}
