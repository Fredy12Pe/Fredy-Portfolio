"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Center,
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

useGLTF.preload("/models/duck.glb");

function DuckModel({
  selected,
  onHover,
  onSelect,
}: {
  selected: boolean;
  onHover: (value: boolean) => void;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/duck.glb");
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map((m) => m.clone())
          : mesh.material.clone();
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    prepared.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) {
        const std = mat as THREE.MeshStandardMaterial;
        if ("emissive" in std) {
          std.emissive = new THREE.Color(hovered || selected ? "#3d5c00" : "#000000");
          std.emissiveIntensity = selected ? 0.55 : hovered ? 0.28 : 0;
        }
      }
    });
  }, [prepared, hovered, selected]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = selected ? 1.15 : hovered ? 1.08 : 1;
    const s = group.current.scale.x;
    const next = THREE.MathUtils.damp(s, target, 8, delta);
    group.current.scale.setScalar(next);
    if (!selected) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Center>
        <primitive object={prepared} />
      </Center>
      {selected && (
        <Html position={[0, 1.35, 0]} center distanceFactor={8}>
          <div className="rounded-md border border-white/15 bg-black/75 px-3 py-1.5 text-xs text-white backdrop-blur">
            Duck selected — click again to deselect
          </div>
        </Html>
      )}
    </group>
  );
}

function ViewerScene({ onHoverChange }: { onHoverChange: (hovered: boolean) => void }) {
  const [selected, setSelected] = useState(false);

  return (
    <>
      <color attach="background" args={["#0c0c0c"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={1.2} />
      <Environment preset="city" environmentIntensity={0.35} />

      <Suspense fallback={null}>
        <DuckModel
          selected={selected}
          onHover={onHoverChange}
          onSelect={() => setSelected((v) => !v)}
        />
      </Suspense>

      <ContactShadows
        position={[0, -0.85, 0]}
        opacity={0.45}
        scale={8}
        blur={2.5}
        far={3}
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        maxPolarAngle={Math.PI / 1.7}
      />
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function ModelViewer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [hint, setHint] = useState("Hover the model");

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [2.4, 1.4, 3.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ViewerScene
          onHoverChange={(h) => setHint(h ? "Click to select" : "Hover the model")}
        />
      </Canvas>
      <p className="pointer-events-none absolute left-4 top-4 text-[11px] text-neutral-400">
        {hint}
      </p>
    </div>
  );
}
