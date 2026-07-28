"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useRef } from "react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type ProgressRef = React.MutableRefObject<number>;

const PATH = [
  new THREE.Vector3(0, 0.6, 5.5),
  new THREE.Vector3(1.8, 0.4, 2.2),
  new THREE.Vector3(-1.4, 1.1, -0.5),
  new THREE.Vector3(0.3, 0.2, -3.5),
];

const LOOK = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0.4, 0.2, -1),
  new THREE.Vector3(-0.2, 0.5, -2),
  new THREE.Vector3(0, 0.3, -4),
];

function Markers() {
  return (
    <group>
      {[
        [0, 0, 0],
        [1.2, 0.3, -1.5],
        [-1.1, 0.6, -2.8],
        [0.2, 0.1, -4.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial
            color={i === 0 ? "#95E100" : i === 3 ? "#11B30B" : "#BEDA76"}
            metalness={0.2}
            roughness={0.35}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, -1.5]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#121212" roughness={1} />
      </mesh>
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const lookTarget = useRef(new THREE.Vector3());
  const camPos = useRef(new THREE.Vector3().copy(PATH[0]));

  useFrame((state, delta) => {
    const p = progressRef.current;
    const segments = PATH.length - 1;
    const scaled = p * segments;
    const i = Math.min(Math.floor(scaled), segments - 1);
    const t = scaled - i;

    camPos.current.lerpVectors(PATH[i], PATH[i + 1], t);
    lookTarget.current.lerpVectors(LOOK[i], LOOK[i + 1], t);

    state.camera.position.lerp(camPos.current, 1 - Math.exp(-6 * delta));
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}

function Scene({ progressRef }: { progressRef: ProgressRef }) {
  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 2]} intensity={1.1} />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color="#C7EF13" />
      <Markers />
      <CameraRig progressRef={progressRef} />
    </>
  );
}

export default function ScrollCamera() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-[280vh]">
      <div className="sticky top-0 h-[70vh] overflow-hidden rounded-lg border border-white/10 bg-neutral-900/80">
        <Canvas
          className="h-full w-full"
          dpr={[1, 1.5]}
          camera={{ position: PATH[0].toArray(), fov: 45, near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene progressRef={progressRef} />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <p className="text-sm text-neutral-200">
            Scroll through this section — Lenis + ScrollTrigger drive the camera path.
          </p>
        </div>
      </div>
    </div>
  );
}
