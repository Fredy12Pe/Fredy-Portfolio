"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

type CardProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
};

type MouseRef = MutableRefObject<{ x: number; y: number }>;

function Card({ position, rotation = [0, 0, 0], color }: CardProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1.6, 1.05]} />
      <meshStandardMaterial
        color={color}
        metalness={0.15}
        roughness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Scene({ mouse }: { mouse: MouseRef }) {
  const root = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  const cards = useMemo(
    () =>
      [
        { position: [-1.35, 0.35, 0.4] as const, color: "#95E100", rotation: [0, 0.2, -0.08] as const },
        { position: [0.15, 0.55, -0.35] as const, color: "#11B30B", rotation: [0.08, -0.1, 0.04] as const },
        { position: [1.25, -0.15, -0.9] as const, color: "#BEDA76", rotation: [-0.05, 0.35, 0.06] as const },
        { position: [-0.4, -0.7, -1.4] as const, color: "#C7EF13", rotation: [0.12, -0.25, -0.05] as const },
      ] satisfies CardProps[],
    []
  );

  useFrame((state, delta) => {
    const targetX = mouse.current.x * 1.4;
    const targetY = mouse.current.y * 0.9;

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 4, delta);
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      targetY + 0.2,
      4,
      delta
    );
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 4.2, 4, delta);
    state.camera.lookAt(0, 0, -0.4);

    if (light.current) {
      light.current.position.x = THREE.MathUtils.damp(
        light.current.position.x,
        mouse.current.x * 3,
        3,
        delta
      );
      light.current.position.y = THREE.MathUtils.damp(
        light.current.position.y,
        mouse.current.y * 2 + 1.5,
        3,
        delta
      );
    }

    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        mouse.current.x * 0.18,
        3,
        delta
      );
    }
  });

  return (
    <>
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={0.85} />
      <pointLight ref={light} position={[0, 1.5, 2]} intensity={1.4} color="#E5F7B3" />

      <group ref={root}>
        <group name="cards">
          {cards.map((card) => (
            <Card key={card.color + card.position.join(",")} {...card} />
          ))}
        </group>
        <mesh name="backdrop" position={[0, 0, -2.2]}>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#141414" roughness={1} metalness={0} />
        </mesh>
      </group>
    </>
  );
}

export default function FloatingCards() {
  const mouse = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className="h-full w-full"
      onPointerMove={(e) => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        mouse.current.x = 0;
        mouse.current.y = 0;
      }}
    >
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
