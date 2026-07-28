"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cubicBezier } from "motion/react";

/**
 * Direct local port of Framer's AnimatedLiquidBackground_Prod
 * (https://framer.com/m/AnimatedLiquidBackground-Prod-vIhm.js@ghH1aHLmGZ0iE7qXDFVk)
 *
 * The linked component uses an older Paper shader. The current
 * `@paper-design/shaders` Warp has different uniforms and rendering,
 * so using it with copied preset values does not produce the same effect.
 */
export type LiquidPreset = "Prism" | "Lava" | "Plasma" | "Pulse" | "Vortex" | "Mist";

type PresetValues = {
  colors: string[];
  rotation: number;
  proportion: number;
  scale: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  softness: number;
  shape: number;
  shapeScale: number;
  seed: number;
};

/** Exact Framer template values after its /100, /50, radians, and seed conversions. */
const PRESETS: Record<LiquidPreset, PresetValues> = {
  Prism: {
    colors: ["#050505", "#66B3FF", "#FFFFFF"],
    rotation: (-50 * Math.PI) / 180,
    proportion: 0.01,
    scale: 0.01,
    distortion: 0,
    swirl: 0.5,
    swirlIterations: 16,
    softness: 0.47,
    shape: 0,
    shapeScale: 0.45,
    seed: -2990,
  },
  Lava: {
    colors: ["#FF9F21", "#FF0303", "#000000"],
    rotation: (114 * Math.PI) / 180,
    proportion: 1,
    scale: 0.52,
    distortion: 0.14,
    swirl: 0.18,
    swirlIterations: 20,
    softness: 1,
    shape: 2,
    shapeScale: 0.12,
    seed: 7170,
  },
  Plasma: {
    colors: ["#B566FF", "#000000", "#000000"],
    rotation: 0,
    proportion: 0.63,
    scale: 0.75,
    distortion: 0.1,
    swirl: 0.61,
    swirlIterations: 5,
    softness: 1,
    shape: 0,
    shapeScale: 0.28,
    seed: -1680,
  },
  Pulse: {
    colors: ["#66FF85", "#000000", "#000000"],
    rotation: (-167 * Math.PI) / 180,
    proportion: 0.92,
    scale: 0,
    distortion: 1.08,
    swirl: 0.75,
    swirlIterations: 3,
    softness: 0.28,
    shape: 0,
    shapeScale: 0.79,
    seed: -8130,
  },
  Vortex: {
    colors: ["#000000", "#FFFFFF", "#000000"],
    rotation: (50 * Math.PI) / 180,
    proportion: 0.41,
    scale: 0.4,
    distortion: 0,
    swirl: 1,
    swirlIterations: 3,
    softness: 0.05,
    shape: 1,
    shapeScale: 0.8,
    seed: -7440,
  },
  Mist: {
    colors: ["#050505", "#FF66B8", "#050505"],
    rotation: 0,
    proportion: 0.33,
    scale: 0.48,
    distortion: 0.08,
    swirl: 0.65,
    swirlIterations: 5,
    softness: 1,
    shape: 2,
    shapeScale: 0.48,
    seed: -2350,
  },
};

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
  vec3 blended_color_2 = mix(color1, color2, r1);
  float blended_opacity_2 = mix(c1.a, c2.a, r1);
  vec3 c = mix(blended_color_2, color3, r2);
  float o = mix(blended_opacity_2, c3.a, r2);
  return vec4(c, o);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float noise_scale = .0005 + .006 * u_scale;

  uv -= .5;
  uv *= (noise_scale * u_resolution);
  uv = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio;
  uv += .5;

  float n1 = noise(uv * 1. + t);
  float n2 = noise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);

  float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  float shape = 0.;
  float mixer = 0.;
  if (u_shape < .5) {
    vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float sh = 1. - uv.y;
    sh -= .5;
    sh /= (noise_scale * u_resolution.y);
    sh += .5;
    float shape_scaling = .2 * (1. - u_shapeScale);
    shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
    mixer = shape;
  }

  vec4 color_mix = blend_colors(
    u_color1,
    u_color2,
    u_color3,
    mixer,
    1. - clamp(u_softness, 0., 1.),
    .01 + .01 * u_scale
  );
  fragColor = vec4(color_mix.rgb, color_mix.a);
}`;

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

type ContactLiquidBgProps = {
  className?: string;
  active?: boolean;
  preset?: LiquidPreset;
  speed?: number;
  style?: CSSProperties;
};

type UniformValues = Record<string, number | [number, number, number, number]>;

function hexToRgba(hex: string): [number, number, number, number] {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
    1,
  ];
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Liquid background shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Liquid background shader link failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function ContactLiquidBg({
  className,
  active = true,
  preset = "Prism",
  speed = 25,
  style,
}: ContactLiquidBgProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(true);
  const values = PRESETS[preset];
  const speedEase = useMemo(() => cubicBezier(0.65, 0, 0.88, 0.77), []);
  const playbackSpeed = active && inView ? speedEase(speed / 100) * 5 : 0;
  const playbackSpeedRef = useRef(playbackSpeed);

  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;
    const program = createProgram(gl);
    if (!program) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const uniforms: UniformValues = {
      u_scale: values.scale,
      u_rotation: values.rotation,
      u_color1: hexToRgba(values.colors[0]),
      u_color2: hexToRgba(values.colors[1]),
      u_color3: hexToRgba(values.colors[2]),
      u_proportion: values.proportion,
      u_softness: values.softness,
      u_distortion: values.distortion,
      u_swirl: values.swirl,
      u_swirlIterations: values.swirl === 0 ? 0 : values.swirlIterations,
      u_shapeScale: values.shapeScale,
      u_shape: values.shape,
    };

    for (const [name, value] of Object.entries(uniforms)) {
      const location = gl.getUniformLocation(program, name);
      if (typeof value === "number") gl.uniform1f(location, value);
      else gl.uniform4fv(location, value);
    }

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const pixelRatioLocation = gl.getUniformLocation(program, "u_pixelRatio");
    let totalAnimationTime = values.seed * (1000 / 120);
    let lastFrameTime = performance.now();
    let frameId = 0;

    const resize = () => {
      const pixelRatio = window.devicePixelRatio;
      const width = canvas.clientWidth * pixelRatio;
      const height = canvas.clientHeight * pixelRatio;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(pixelRatioLocation, pixelRatio);
    };

    const render = (now: number) => {
      totalAnimationTime += (now - lastFrameTime) * playbackSpeedRef.current;
      lastFrameTime = now;
      resize();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, totalAnimationTime * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [values]);

  return (
    <div
      ref={rootRef}
      className={className}
      aria-hidden
      style={{ background: values.colors[0], ...style }}
    >
      <canvas
        ref={canvasRef}
        data-paper-shaders="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
