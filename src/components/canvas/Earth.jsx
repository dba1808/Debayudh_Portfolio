import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Earth = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();

  // Pre-compute continent positions so they're stable across renders
  const continents = useMemo(() => {
    const seed = [0.2, 0.7, 0.4, 0.9, 0.1, 0.6, 0.3, 0.8];
    const seed2 = [0.5, 0.3, 0.8, 0.1, 0.6, 0.9, 0.2, 0.7];
    const sizes = [0.35, 0.45, 0.5, 0.3, 0.55, 0.4, 0.38, 0.42];
    return seed.map((s, i) => {
      const phi = Math.acos(2 * s - 1);
      const theta = 2 * Math.PI * seed2[i];
      return {
        position: [
          2.01 * Math.sin(phi) * Math.cos(theta),
          2.01 * Math.sin(phi) * Math.sin(theta),
          2.01 * Math.cos(phi),
        ],
        size: sizes[i],
      };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.15;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.1;
      cloudsRef.current.rotation.x = t * 0.05;
    }
  });

  return (
    <group ref={earthRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color='#b4c6ef' />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color='#915eff' />

      {/* Main sphere - Earth */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color='#1a4f8a'
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>

      {/* Continent-like patches */}
      {continents.map((c, i) => (
        <mesh key={i} position={c.position}>
          <sphereGeometry args={[c.size, 8, 8]} />
          <meshStandardMaterial
            color='#2d8a4e'
            metalness={0.2}
            roughness={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Atmosphere glow */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshStandardMaterial
          color='#915eff'
          transparent
          opacity={0.08}
          metalness={0}
          roughness={1}
        />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3.2, 64]} />
        <meshStandardMaterial
          color='#915eff'
          transparent
          opacity={0.06}
          side={2}
        />
      </mesh>
    </group>
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default EarthCanvas;
