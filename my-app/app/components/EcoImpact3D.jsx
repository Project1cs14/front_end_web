"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Text,
  Environment,
} from "@react-three/drei";
import { useMemo } from "react";

function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* trunk */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>

      {/* leaves */}
      <mesh castShadow position={[0, 1.4, 0]}>
        <coneGeometry args={[0.55, 1.1, 8]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>

      <mesh castShadow position={[0, 1.8, 0]}>
        <coneGeometry args={[0.4, 0.8, 8]} />
        <meshStandardMaterial color="#388E3C" />
      </mesh>
    </group>
  );
}

function Water({ scale }) {
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.02, 0]}
      scale={[scale, 1, scale]}
    >
      <circleGeometry args={[1.8, 32]} />
      <meshStandardMaterial
        color="#64B5F6"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function InfoLabel({
  position,
  title,
  value,
}) {
  return (
    <Float speed={2}>
      <Text
        position={position}
        fontSize={0.28}
        color="#1A1C1E"
        anchorX="center"
      >
        {title}
        {"\n"}
        {value}
      </Text>
    </Float>
  );
}

export default function EcoImpact3D({
  impact,
}) {
  const treeCount = Math.min(
    80,
    Math.max(
      1,
      Math.round(
        Number(
          impact?.treesSaved || 1
        ) * 8
      )
    )
  );

  const waterScale = Math.min(
    2.2,
    Math.max(
      0.7,
      Number(
        impact?.waterSaved || 0
      ) / 500
    )
  );

  const co2Cleanliness =
    Number(impact?.co2Saved || 0);

  // Natural forest layout
  const trees = useMemo(() => {
    return Array.from({
      length: treeCount,
    }).map((_, i) => {
      const angle =
        i * 137.5 *
        (Math.PI / 180);

      const radius =
        1 +
        Math.sqrt(i) * 0.5;

      return {
        x:
          Math.cos(angle) *
          radius,
        z:
          Math.sin(angle) *
          radius,
        scale:
          0.8 +
          Math.random() * 0.5,
      };
    });
  }, [treeCount]);

  return (
    <div className="h-[360px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-green-50 to-green-100">
      <Canvas
        shadows
        camera={{
          position: [6, 5, 8],
          fov: 45,
        }}
      >
        {/* Atmosphere */}
        <fog
          attach="fog"
          args={[
            "#eef8ef",
            8,
            22 -
              co2Cleanliness * 2,
          ]}
        />

        {/* Lights */}
        <ambientLight
          intensity={1.2}
        />

        <directionalLight
          castShadow
          position={[6, 8, 5]}
          intensity={2}
        />

        <Environment preset="sunset" />

        {/* Ground */}
        <mesh
          receiveShadow
          rotation={[
            -Math.PI / 2,
            0,
            0,
          ]}
        >
          <circleGeometry
            args={[8, 64]}
          />
          <meshStandardMaterial color="#81C784" />
        </mesh>

        {/* Water */}
        <Water
          scale={waterScale}
        />

        {/* Trees */}
        {trees.map(
          (tree, index) => (
            <Tree
              key={index}
              position={[
                tree.x,
                0,
                tree.z,
              ]}
              scale={
                tree.scale +
                co2Cleanliness *
                  0.1
              }
            />
          )
        )}

        {/* Floating labels */}
        <InfoLabel
          position={[
            -4,
            3,
            0,
          ]}
          title="🌳 Trees"
          value={`${impact?.treesSaved || 0}`}
        />

        <InfoLabel
          position={[
            0,
            3,
            0,
          ]}
          title="💧 Water"
          value={`${impact?.waterSaved || 0}L`}
        />

        <InfoLabel
          position={[
            4,
            3,
            0,
          ]}
          title="🌍 CO₂"
          value={`${impact?.co2Saved || 0}kg`}
        />

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={
            Math.PI / 2.1
          }
        />
      </Canvas>
    </div>
  );
}