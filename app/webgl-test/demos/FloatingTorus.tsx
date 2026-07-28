"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Torus() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 1.2) * 0.35;
    ref.current.rotation.x = t * 0.25;
    ref.current.rotation.y = t * 0.4;
  });

  return (
    <mesh ref={ref} scale={1.1}>
      <torusGeometry args={[1, 0.35, 48, 100]} />
      <MeshDistortMaterial
        color="#11B30B"
        distort={0.35}
        speed={2}
        roughness={0.25}
        metalness={0.15}
      />
    </mesh>
  );
}

export default function FloatingTorus() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.3} />
      <pointLight position={[-3, -2, -2]} intensity={0.6} color="#C7EF13" />
      <Torus />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
