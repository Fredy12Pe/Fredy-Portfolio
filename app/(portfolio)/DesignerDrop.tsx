"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import styles from "./SiteHeader.module.css";

const DISSOLVE = 0.23;
const SIM_H = 640;

const SIM_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SIM_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev, uSrc;
  uniform vec2 uTexel;
  uniform float uTime;
  uniform vec4 uPill;
  uniform float uRadius;
  uniform float uAspect;

  const float NECK_FADE  = 0.030;
  const float NECK_KEEP  = 0.035;
  const float DROP_REACH = 5.2;
  const float TENSION    = 0.16;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(float x) {
    float i = floor(x), f = fract(x);
    float a = hash(vec2(i, 0.0)), b = hash(vec2(i + 1.0, 0.0));
    return mix(a, b, f * f * (3.0 - 2.0 * f));
  }
  float pillDist(vec2 uv) {
    vec2 p = (uv - uPill.xy) * vec2(uAspect, 1.0);
    vec2 b = vec2(uPill.z * uAspect, uPill.w);
    float r = min(uRadius, min(b.x, b.y));
    vec2 q = abs(p) - b + vec2(r);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  float prevAt(vec2 uv) {
    if (pillDist(uv) < 0.0) return 0.0;
    return texture2D(uPrev, uv).r;
  }

  void main() {
    float a0 = texture2D(uSrc, vUv).a;
    float a1 = texture2D(uSrc, vUv + vec2(uTexel.x * 2.5, 0.0)).a;
    float a2 = texture2D(uSrc, vUv - vec2(uTexel.x * 2.5, 0.0)).a;
    float a3 = texture2D(uSrc, vUv + vec2(0.0, uTexel.y * 2.5)).a;
    float a4 = texture2D(uSrc, vUv - vec2(0.0, uTexel.y * 2.5)).a;
    float srcA = max(max(a0, a1), max(max(a2, a3), a4));
    float src = smoothstep(0.03, 0.16, srcA) * 0.95;
    float prev = prevAt(vUv);

    float col = vUv.x * 1024.0;
    float visc = noise(col * 0.035) * 0.5
      + noise(col * 0.13 + 7.0) * 0.25
      + noise(col * 0.06 + uTime * 0.07) * 0.25;

    float wob = ((noise(col * 0.08 + uTime * 0.15) - 0.5)
      + (noise(vUv.y * 38.0 + col * 0.013 + uTime * 0.45) - 0.5) * 0.7)
      * uTexel.x * 2.2;
    float grav = 1.0 + (1.0 - vUv.y) * 1.5;
    float up1 = prevAt(vUv + vec2(wob, uTexel.y * grav));
    float up2 = prevAt(vUv + vec2(wob * 1.6, uTexel.y * 2.0 * grav));
    float up3 = prevAt(vUv + vec2(wob * 2.3, uTexel.y * 3.2 * grav));
    float speedN = noise(col * 0.045 + uTime * 0.12);
    float pull = mix(up1, up2, smoothstep(0.45, 0.80, speedN));
    pull = mix(pull, max(pull, up3), smoothstep(0.70, 0.97, speedN));

    float wayAbove = prevAt(vUv + vec2(0.0, uTexel.y * 10.0 * grav));
    float detached = (1.0 - smoothstep(0.04, 0.22, wayAbove))
      * smoothstep(0.06, 0.30, pull)
      * (1.0 - src);
    float upFar = prevAt(vUv + vec2(wob * 2.0, uTexel.y * DROP_REACH * grav));
    pull = max(pull, upFar * detached);

    float lf = prevAt(vUv + vec2(-uTexel.x, uTexel.y * 0.4));
    float rt = prevAt(vUv + vec2(uTexel.x, uTexel.y * 0.4));
    float side = max(lf, rt) * (0.944 + visc * 0.035);
    float screenAbove = prevAt(vUv + vec2(0.0, uTexel.y));
    float screenBelow = prevAt(vUv + vec2(0.0, -uTexel.y));
    float blur = (lf + rt + screenAbove + screenBelow) * 0.25;
    float lf2 = prevAt(vUv + vec2(-uTexel.x * 2.5, 0.0));
    float rt2 = prevAt(vUv + vec2(uTexel.x * 2.5, 0.0));
    float thin = 1.0 - smoothstep(0.05, 0.35, max(lf2, rt2));
    float hanging = smoothstep(0.15, 0.50, screenAbove) * smoothstep(0.15, 0.50, screenBelow);
    float neck = thin * hanging * (1.0 - src);
    float breakN = smoothstep(0.45, 0.85, noise(col * 0.05 + uTime * 0.55));
    float pinch = neck * breakN;

    float keep = 0.980 + visc * 0.019 - pinch * NECK_KEEP;
    float fall = pull * keep;
    float head = pull * (1.0 - smoothstep(0.02, 0.30, screenBelow));
    fall = max(fall, head);

    float flow = 0.36 + visc * 0.44 + 0.18 * noise(col * 0.02 + uTime * 0.30);
    flow = min(1.0, flow + detached * 0.30);

    float target = max(fall, side);
    float v = mix(prev, target, flow);
    v = mix(v, blur, TENSION);
    v = max(v, prev * (0.9965 - pinch * NECK_FADE));
    v = min(v, 1.0);

    float dist = pillDist(vUv);
    float blocked = 1.0 - smoothstep(-0.002, 0.01, dist);
    float outward = sign(vUv.x - uPill.x);
    if (outward == 0.0) outward = 1.0;
    float near = (1.0 - smoothstep(0.0, 0.09, dist)) * step(uPill.y - uPill.w, vUv.y);
    float slid = prevAt(vUv + vec2(outward * uTexel.x * 8.0, uTexel.y * 1.4));
    v = mix(v, max(v, slid), near * (1.0 - blocked));
    v *= 1.0 - blocked;
    v = max(v, src * (1.0 - blocked));

    gl_FragColor = vec4(v, 0.0, 0.0, 1.0);
  }
`;

const COMP_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSim, uText;
  uniform float uTime, uDissolve;
  uniform vec2 uTexelS;

  const float FAT_R = 2.5;
  const float FAT_CAP = 0.42;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(269.5, 183.3)) + uTime) * 43758.5453);
  }
  float hash2(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash2(i), b = hash2(i + vec2(1.0, 0.0));
    float c = hash2(i + vec2(0.0, 1.0)), d = hash2(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float v = texture2D(uSim, vUv).r;
    vec4 tc = texture2D(uText, vUv);

    vec2 fo = uTexelS * FAT_R;
    float vb = v * 0.28
      + (texture2D(uSim, vUv + vec2(fo.x, 0.0)).r
      + texture2D(uSim, vUv - vec2(fo.x, 0.0)).r
      + texture2D(uSim, vUv + vec2(0.0, fo.y)).r
      + texture2D(uSim, vUv - vec2(0.0, fo.y)).r) * 0.13
      + (texture2D(uSim, vUv + fo * 0.707).r
      + texture2D(uSim, vUv - fo * 0.707).r
      + texture2D(uSim, vUv + vec2(fo.x, -fo.y) * 0.707).r
      + texture2D(uSim, vUv + vec2(-fo.x, fo.y) * 0.707).r) * 0.05;
    float fat = smoothstep(0.12, 0.44, vb) * FAT_CAP;
    float hiBand = smoothstep(0.72, 0.86, v);
    v = max(v, fat * (1.0 - hiBand));

    float inText = smoothstep(0.25, 0.75, tc.a);
    float dripMask = 1.0 - smoothstep(0.89, 0.925, v) * (1.0 - uDissolve * inText);
    float fall1 = noise2(vec2(vUv.x * 70.0, vUv.y * 7.0 + uTime * 1.6));
    float fall2 = noise2(vec2(vUv.x * 28.0, vUv.y * 3.5 + uTime * 0.8));
    float stream = fall1 * 0.55 + fall2 * 0.45;

    vec3 deepBlue = vec3(0.02, 0.10, 0.45);
    vec3 cyan = vec3(0.20, 0.95, 1.00);
    vec3 white = vec3(0.92, 1.00, 1.00);
    vec3 hotRed = vec3(0.95, 0.18, 0.05);
    vec3 fluid = vec3(0.0);
    fluid = mix(fluid, deepBlue, smoothstep(0.03, 0.18, v));
    fluid = mix(fluid, cyan, smoothstep(0.18, 0.50, v));
    fluid = mix(fluid, white, smoothstep(0.50, 0.66, v));
    fluid = mix(fluid, hotRed, smoothstep(0.68, 0.78, v));
    fluid = mix(fluid, vec3(0.42, 0.075, 0.067), smoothstep(0.80, 0.88, v));
    fluid = mix(fluid, vec3(1.0, 0.34, 0.10), smoothstep(0.905, 0.928, v));
    float glow = smoothstep(0.12, 0.5, v) * (1.0 - smoothstep(0.55, 0.85, v));
    fluid += cyan * glow * 0.35;
    fluid *= mix(1.0, 0.78 + 0.34 * stream, dripMask);

    float fluidA = smoothstep(0.03, 0.10, v);
    vec3 tcol = tc.rgb / max(tc.a, 0.001);
    float ta = smoothstep(0.25, 0.75, tc.a);
    vec3 rgb = mix(fluid, tcol, ta * (1.0 - uDissolve));
    float alpha = max(fluidA, ta);
    rgb += (hash(gl_FragCoord.xy * 0.7) - 0.5) * 0.08 * alpha;
    gl_FragColor = vec4(rgb * alpha, alpha);
  }
`;

export default function DesignerDrop({
  wordRef,
}: {
  wordRef: RefObject<HTMLSpanElement | null>;
}) {
  useLayoutEffect(() => {
    const word = wordRef.current;
    const bounds = word?.closest("header") ?? null;
    const obstacle = bounds?.querySelector<HTMLElement>("[data-portrait]") ?? null;
    if (!word || !bounds) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = styles.dropCanvas;
    canvas.setAttribute("aria-hidden", "true");
    bounds.appendChild(canvas);

    let title: HTMLElement | null = null;

    const colorManagement = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    renderer.setClearColor(0x000000, 0);

    const sourceCanvas = document.createElement("canvas");
    const sourceCtx = sourceCanvas.getContext("2d", { alpha: true });
    const textTexture = new THREE.CanvasTexture(sourceCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.generateMipmaps = false;
    textTexture.flipY = true;

    const simScene = new THREE.Scene();
    const compScene = new THREE.Scene();
    const simCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const simMat = new THREE.ShaderMaterial({
      uniforms: {
        uPrev: { value: null },
        uSrc: { value: textTexture },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uPill: { value: new THREE.Vector4(0.5, -2, 0, 0) },
        uRadius: { value: 0 },
        uAspect: { value: 1 },
      },
      vertexShader: SIM_VERT,
      fragmentShader: SIM_FRAG,
    });
    const compMat = new THREE.ShaderMaterial({
      uniforms: {
        uSim: { value: null },
        uText: { value: textTexture },
        uTime: { value: 0 },
        uDissolve: { value: DISSOLVE },
        uTexelS: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: SIM_VERT,
      fragmentShader: COMP_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const simMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat);
    const compMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compMat);
    simScene.add(simMesh);
    compScene.add(compMesh);

    let rtA: THREE.WebGLRenderTarget | null = null;
    let rtB: THREE.WebGLRenderTarget | null = null;

    const makeTargets = (width: number, height: number) => {
      const simH = SIM_H;
      const simW = Math.max(256, Math.round(SIM_H * (width / Math.max(1, height))));
      rtA?.dispose();
      rtB?.dispose();
      const options = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        depthBuffer: false,
        stencilBuffer: false,
      };
      rtA = new THREE.WebGLRenderTarget(simW, simH, options);
      rtB = new THREE.WebGLRenderTarget(simW, simH, options);
      simMat.uniforms.uTexel.value.set(1 / simW, 1 / simH);
      compMat.uniforms.uTexelS.value.set(1 / simW, 1 / simH);
      renderer.setRenderTarget(rtA);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.setRenderTarget(rtB);
      renderer.clear();
      renderer.setRenderTarget(null);
    };

    const paintWord = () => {
      if (!sourceCtx) return;
      const wordBox = word.getBoundingClientRect();
      const canvasBox = canvas.getBoundingClientRect();
      const style = getComputedStyle(word);
      const fontPx = parseFloat(style.fontSize) || 100;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sourceCanvas.width = Math.max(1, canvas.width);
      sourceCanvas.height = Math.max(1, canvas.height);
      sourceCtx.setTransform(1, 0, 0, 1, 0, 0);
      sourceCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
      sourceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sourceCtx.font = style.font;
      sourceCtx.fillStyle = "#4d0d0b";
      sourceCtx.textAlign = "center";
      sourceCtx.textBaseline = "alphabetic";
      sourceCtx.letterSpacing = style.letterSpacing;
      const lineHeight = parseFloat(style.lineHeight) || fontPx * 0.92;
      const halfLeading = (lineHeight - fontPx) / 2;
      const ascent = sourceCtx.measureText("Hg").fontBoundingBoxAscent || fontPx * 0.8;
      const x = wordBox.left - canvasBox.left + wordBox.width / 2;
      const baseline = wordBox.top - canvasBox.top + halfLeading + ascent;
      sourceCtx.fillText(word.textContent ?? "DESIGNER", x, baseline);
      textTexture.needsUpdate = true;
    };

    const place = () => {
      const host = bounds.getBoundingClientRect();
      const wordBox = word.getBoundingClientRect();
      const fontPx = parseFloat(getComputedStyle(word).fontSize) || 100;
      const pad = fontPx * 0.35;
      const top = wordBox.top - host.top - pad;
      const height = Math.max(1, host.bottom - wordBox.top + pad);
      const width = Math.max(1, host.width);
      canvas.style.left = "0px";
      canvas.style.top = `${top}px`;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bufferW = Math.max(1, Math.round(width * dpr));
      const bufferH = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== bufferW || canvas.height !== bufferH) {
        renderer.setSize(bufferW, bufferH, false);
        makeTargets(bufferW, bufferH);
      }
      paintWord();
    };

    const updatePill = () => {
      const obstacleBox = obstacle?.getBoundingClientRect();
      const canvasBox = canvas.getBoundingClientRect();
      if (!obstacle || !obstacleBox || canvasBox.width < 1 || canvasBox.height < 1) {
        simMat.uniforms.uPill.value.set(0.5, -2, 0, 0);
        return;
      }
      const pill = obstacleBox;
      const radius = Math.min(
        pill.width / 2,
        pill.height / 2,
        parseFloat(getComputedStyle(obstacle).borderTopLeftRadius) || pill.width / 2,
      );
      simMat.uniforms.uAspect.value = canvasBox.width / canvasBox.height;
      simMat.uniforms.uRadius.value = radius / canvasBox.height;
      simMat.uniforms.uPill.value.set(
        (pill.left + pill.width / 2 - canvasBox.left) / canvasBox.width,
        1 - (pill.top + pill.height / 2 - canvasBox.top) / canvasBox.height,
        pill.width / 2 / canvasBox.width,
        pill.height / 2 / canvasBox.height,
      );
    };

    const start = performance.now();
    const tick = () => {
      if (!rtA || !rtB) return;
      const time = (performance.now() - start) / 1000;
      updatePill();
      renderer.setClearColor(0x000000, 0);
      for (let step = 0; step < 4; step += 1) {
        simMat.uniforms.uPrev.value = rtA.texture;
        simMat.uniforms.uTime.value = time;
        renderer.setRenderTarget(rtB);
        renderer.render(simScene, simCam);
        const previous = rtA;
        rtA = rtB;
        rtB = previous;
      }
      renderer.setRenderTarget(null);
      renderer.setViewport(0, 0, canvas.width, canvas.height);
      compMat.uniforms.uSim.value = rtA.texture;
      compMat.uniforms.uTime.value = time;
      renderer.clear();
      renderer.render(compScene, simCam);
    };

    place();
    tick();
    title = word.closest("h1");
    if (title) title.dataset.melt = "on";
    const resize = new ResizeObserver(() => place());
    resize.observe(bounds);
    resize.observe(word);
    document.fonts.ready.then(() => place()).catch(() => undefined);
    gsap.ticker.add(tick);

    return () => {
      resize.disconnect();
      gsap.ticker.remove(tick);
      if (title) delete title.dataset.melt;
      canvas.remove();
      textTexture.dispose();
      rtA?.dispose();
      rtB?.dispose();
      simMesh.geometry.dispose();
      compMesh.geometry.dispose();
      simMat.dispose();
      compMat.dispose();
      renderer.dispose();
      THREE.ColorManagement.enabled = colorManagement;
    };
  }, [wordRef]);

  return null;
}
