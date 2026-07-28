"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { ComponentType } from "react";

const SpinningBox = dynamic(() => import("./demos/SpinningBox"), { ssr: false });
const FloatingTorus = dynamic(() => import("./demos/FloatingTorus"), { ssr: false });
const ParticleField = dynamic(() => import("./demos/ParticleField"), { ssr: false });
const FloatingCards = dynamic(() => import("./demos/FloatingCards"), { ssr: false });
const ScrollCamera = dynamic(() => import("./demos/ScrollCamera"), { ssr: false });
const ModelViewer = dynamic(() => import("./demos/ModelViewer"), { ssr: false });

type Demo = {
  id: string;
  title: string;
  description: string;
  Component: ComponentType;
  height?: string;
  fullBleed?: boolean;
};

const demos: Demo[] = [
  {
    id: "spinning-box",
    title: "1. Spinning box",
    description: "Basic mesh + useFrame rotation — R3F hello world.",
    Component: SpinningBox,
  },
  {
    id: "floating-torus",
    title: "2. Floating torus",
    description: "Distort material, bobbing motion, and OrbitControls drag.",
    Component: FloatingTorus,
  },
  {
    id: "particle-field",
    title: "3. Particle field",
    description: "GPU points buffer with slow drift — light atmospheric layer.",
    Component: ParticleField,
  },
  {
    id: "floating-cards",
    title: "4. Floating cards · mouse parallax",
    description:
      "Scene graph of depth-layered cards; camera and key light follow pointer.",
    Component: FloatingCards,
    height: "h-[380px]",
  },
  {
    id: "scroll-camera",
    title: "5. Scroll-controlled camera",
    description:
      "Lenis smooth scroll + GSAP ScrollTrigger scrub a camera path through marker spheres.",
    Component: ScrollCamera,
    fullBleed: true,
  },
  {
    id: "model-viewer",
    title: "6. GLB model viewer",
    description:
      "Khronos Duck GLB with hover emissive, click select, AdaptiveDpr, and pause when off-screen.",
    Component: ModelViewer,
    height: "h-[420px]",
  },
];

function LusionLink() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-medium">7. Lusion connectors</h2>
        <p className="text-sm text-neutral-500">
          Identical port of the{" "}
          <a
            href="https://pmndrs.github.io/examples/lusion-connectors/"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-300 underline underline-offset-2"
          >
            pmndrs / Lusion
          </a>{" "}
          physics connectors demo (Rapier + transmission + N8AO).
        </p>
      </div>
      <Link
        href="/webgl-test/lusion-connectors"
        className="flex h-[180px] items-center justify-center rounded-lg border border-white/10 bg-[#141622] text-sm text-neutral-300 transition hover:border-white/25 hover:text-white"
      >
        Open full-screen demo →
      </Link>
    </section>
  );
}

export default function WebGLTestPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-14">
        <header className="space-y-3">
          <Link
            href="/"
            className="inline-block text-sm text-neutral-400 transition hover:text-white"
          >
            ← Back home
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            WebGL / R3F Lab
          </h1>
          <p className="max-w-xl text-neutral-400">
            Foundations plus interaction demos, and a 1:1 port of{" "}
            <Link
              href="/webgl-test/lusion-connectors"
              className="text-neutral-200 underline underline-offset-2 hover:text-white"
            >
              Lusion connectors
            </Link>
            .
          </p>
        </header>

        {demos.map(({ id, title, description, Component, height = "h-[320px]", fullBleed }) => (
          <section key={id} className="space-y-3">
            <div>
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="text-sm text-neutral-500">{description}</p>
            </div>
            {fullBleed ? (
              <Component />
            ) : (
              <div
                className={`${height} overflow-hidden rounded-lg border border-white/10 bg-neutral-900/80`}
              >
                <Component />
              </div>
            )}
          </section>
        ))}

        <LusionLink />
      </div>
    </main>
  );
}
