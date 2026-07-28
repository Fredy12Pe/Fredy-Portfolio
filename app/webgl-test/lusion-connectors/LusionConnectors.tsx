"use client";

// https://twitter.com/lusionltd/status/1701534187545636964
// https://lusion.co
// Port of https://pmndrs.github.io/examples/lusion-connectors/
//
// AO uses three.js EffectComposer + n8ao's N8AOPass (not pmndrs/postprocessing).
// The pmndrs EffectComposer reads getContextAttributes().alpha during React
// render and crashes on Next/React 19 hard reloads when the context is briefly lost.

import * as THREE from "three";
import {
  useRef,
  useReducer,
  useMemo,
  useLayoutEffect,
  Suspense,
  type ComponentProps,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  MeshTransmissionMaterial,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  CuboidCollider,
  BallCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { N8AOPass } from "n8ao";
import { easing } from "maath";

const MODEL_URL = "/models/c-transformed.glb";

const accents = ["#4060ff", "#20ffa0", "#ff4060", "#ffcc00"] as const;

const shuffle = (accent = 0) => [
  { color: "#444", roughness: 0.1 },
  { color: "#444", roughness: 0.75 },
  { color: "#444", roughness: 0.75 },
  { color: "white", roughness: 0.1 },
  { color: "white", roughness: 0.75 },
  { color: "white", roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.75, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
];

type ConnectorProps = {
  position?: [number, number, number];
  children?: React.ReactNode;
  vec?: THREE.Vector3;
  scale?: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  accent?: boolean;
  color?: string;
  roughness?: number;
};

type GLTFResult = {
  nodes: { connector: THREE.Mesh };
  materials: { base: THREE.MeshStandardMaterial };
};

useGLTF.preload(MODEL_URL);

export function Scene(props: ComponentProps<typeof Canvas>) {
  const [accent, click] = useReducer((state: number) => ++state % accents.length, 0);
  const connectors = useMemo(() => shuffle(accent), [accent]);

  return (
    <Canvas
      onClick={click}
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 15], fov: 17.5, near: 1, far: 20 }}
      {...props}
    >
      <color attach="background" args={["#141622"]} />
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <Suspense fallback={null}>
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {connectors.map((connectorProps, i) => (
            <Connector key={i} {...connectorProps} />
          ))}
          <Connector position={[10, 10, 5]}>
            <Model>
              <MeshTransmissionMaterial
                clearcoat={1}
                thickness={0.1}
                anisotropicBlur={0.1}
                chromaticAberration={0.1}
                samples={8}
                resolution={512}
              />
            </Model>
          </Connector>
        </Physics>
      </Suspense>
      <AmbientOcclusion />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="circle"
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={2}
          />
          <Lightformer
            form="circle"
            intensity={2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={8}
          />
        </group>
      </Environment>
    </Canvas>
  );
}

/** Stable WebGL AO pipeline — three.js composer, no pmndrs alpha crash. */
function AmbientOcclusion() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const aoRef = useRef<InstanceType<typeof N8AOPass> | null>(null);

  useLayoutEffect(() => {
    let disposed = false;
    let composer: EffectComposer | null = null;

    const build = () => {
      if (disposed) return;

      const width = Math.max(1, Math.floor(size.width) || gl.domElement.clientWidth || 1);
      const height = Math.max(1, Math.floor(size.height) || gl.domElement.clientHeight || 1);

      if (composer) {
        composer.dispose();
        composer = null;
      }

      composer = new EffectComposer(gl);
      const n8ao = new N8AOPass(scene, camera, width, height);
      n8ao.configuration.aoRadius = 1;
      n8ao.configuration.distanceFalloff = 1;
      n8ao.configuration.intensity = 4;
      composer.addPass(n8ao);
      composer.setSize(width, height);

      composerRef.current = composer;
      aoRef.current = n8ao;
    };

    build();

    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      composerRef.current = null;
      aoRef.current = null;
    };
    const onRestored = () => {
      build();
    };

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);

    return () => {
      disposed = true;
      canvas.removeEventListener("webglcontextlost", onLost, false);
      canvas.removeEventListener("webglcontextrestored", onRestored, false);
      composerRef.current = null;
      aoRef.current = null;
      composer?.dispose();
    };
    // Only rebuild when the renderer/scene/camera identity changes.
    // Size is handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useLayoutEffect(() => {
    const width = Math.max(1, Math.floor(size.width));
    const height = Math.max(1, Math.floor(size.height));
    if (width <= 1 && height <= 1) return;
    composerRef.current?.setSize(width, height);
    aoRef.current?.setSize(width, height);
  }, [size.width, size.height]);

  useFrame(() => {
    composerRef.current?.render();
  }, 1);

  return null;
}

function Connector({
  position,
  children,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  accent,
  ...props
}: ConnectorProps) {
  const api = useRef<RapierRigidBody>(null);
  const pos = useMemo<[number, number, number]>(
    () => position || [r(10), r(10), r(10)],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- match upstream: randomize once on mount
    []
  );

  useFrame((_, delta) => {
    delta = Math.min(0.1, delta);
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(0.2),
      true
    );
  });

  return (
    <RigidBody
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      position={pos}
      ref={api}
      colliders={false}
    >
      <CuboidCollider args={[0.38, 1.27, 0.38]} />
      <CuboidCollider args={[1.27, 0.38, 0.38]} />
      <CuboidCollider args={[0.38, 0.38, 1.27]} />
      {children ? children : <Model {...props} />}
      {accent && <pointLight intensity={4} distance={2.5} color={props.color} />}
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }: { vec?: THREE.Vector3 }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ mouse, viewport }) => {
    ref.current?.setNextKinematicTranslation(
      vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
    );
  });

  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

function Model({
  children,
  color = "white",
  roughness = 0,
}: {
  children?: React.ReactNode;
  color?: string;
  roughness?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { nodes, materials } = useGLTF(MODEL_URL) as unknown as GLTFResult;

  useFrame((_, delta) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.MeshStandardMaterial;
    if (material?.color) {
      easing.dampC(material.color, color, 0.2, delta);
    }
  });

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      scale={10}
      geometry={nodes.connector.geometry}
    >
      <meshStandardMaterial
        metalness={0.2}
        roughness={roughness}
        map={materials.base.map}
      />
      {children}
    </mesh>
  );
}
