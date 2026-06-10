import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  // Since we don't have a real GLTF model, create a stylized computer from primitives
  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      
      {/* Monitor */}
      <group position={[0, isMobile ? -1.5 : -2.25, 0]} scale={isMobile ? 0.5 : 0.65}>
        {/* Monitor Screen */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.5, 2.8, 0.15]} />
          <meshStandardMaterial color='#1a1a2e' metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Screen Display */}
        <mesh position={[0, 2.8, 0.08]}>
          <boxGeometry args={[4.2, 2.5, 0.01]} />
          <meshStandardMaterial color='#0a0a1a' emissive='#915eff' emissiveIntensity={0.15} />
        </mesh>
        {/* Screen Content Lines */}
        {[0, 0.4, 0.8, -0.4, -0.8].map((y, i) => (
          <mesh key={i} position={[-0.5 + i * 0.15, 2.8 + y * 0.3, 0.09]}>
            <boxGeometry args={[1.5 - i * 0.2, 0.06, 0.005]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#915eff' : '#00cea8'} 
              emissive={i % 2 === 0 ? '#915eff' : '#00cea8'}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
        {/* Monitor Stand Neck */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.4, 0.8, 0.3]} />
          <meshStandardMaterial color='#2a2a3e' metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Monitor Stand Base */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.12, 32]} />
          <meshStandardMaterial color='#2a2a3e' metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Desk Surface */}
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <boxGeometry args={[6, 0.15, 3.5]} />
          <meshStandardMaterial color='#1d1836' metalness={0.3} roughness={0.7} />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.7, 1.2]} castShadow>
          <boxGeometry args={[2.5, 0.08, 0.8]} />
          <meshStandardMaterial color='#252540' metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Mouse */}
        <mesh position={[1.8, 0.7, 1.2]} castShadow>
          <boxGeometry args={[0.35, 0.1, 0.55]} />
          <meshStandardMaterial color='#252540' metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Coffee Mug */}
        <mesh position={[-2.2, 0.85, 0.8]} castShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.35, 16]} />
          <meshStandardMaterial color='#915eff' metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Small Plant */}
        <mesh position={[2.5, 0.9, -0.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
          <meshStandardMaterial color='#3a3a4e' />
        </mesh>
        <mesh position={[2.5, 1.25, -0.5]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color='#00cea8' emissive='#00cea8' emissiveIntensity={0.1} />
        </mesh>
        {/* Ambient glow under monitor */}
        <pointLight position={[0, 1.5, 0.5]} color='#915eff' intensity={2} distance={3} />
      </group>
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
