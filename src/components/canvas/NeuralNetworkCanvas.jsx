import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Colors for the terminal nodes on the branches - refined to a premium blue-purple palette
const TERMINAL_COLORS = [
  "#915eff", // Purple
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#a855f7", // Violet
  "#38bdf8", // Light Sky Blue
];

// Helper to generate a glowing circular particle texture for round stars
const createCircleTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);
  
  return new THREE.CanvasTexture(canvas);
};

/* ─────────── Single 3D Neuron Model Internals ─────────── */
const SingleNeuron = ({ activeState }) => {
  const groupRef = useRef();
  const nucleusRef = useRef();
  const nucleusHaloRef = useRef();
  const somaRef = useRef();
  const starsRefA = useRef();
  const starsRefB = useRef();
  const instancedPulsesRef = useRef();

  const branchCount = 8;
  const starCount = 140;

  // Smooth lerp mouse coordinates for camera/group parallax
  const targetRotation = useRef({ x: 0, y: 0 });
  const globalMouse = useRef({ x: 0, y: 0 });
  const hoverProgress = useRef(0);

  // Generate glowing star texture once
  const starTexture = useMemo(() => createCircleTexture(), []);

  // Listen to global mouse events to support mouse parallax even when Canvas is pointer-events-none
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      globalMouse.current.x = x;
      globalMouse.current.y = y;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        globalMouse.current.x = x;
        globalMouse.current.y = y;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // 1. Generate background stars split into two sets for independent twinkling
  const starsA = useMemo(() => {
    const list = [];
    for (let i = 0; i < starCount / 2; i++) {
      list.push(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 - 2
      );
    }
    return new Float32Array(list);
  }, []);

  const starsB = useMemo(() => {
    const list = [];
    for (let i = 0; i < starCount / 2; i++) {
      list.push(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 - 2
      );
    }
    return new Float32Array(list);
  }, []);

  // 2. Generate 8 dendrite branch curves radiating outwards
  const branches = useMemo(() => {
    const list = [];
    const colorCount = TERMINAL_COLORS.length;

    for (let i = 0; i < branchCount; i++) {
      const angle = (i * 2 * Math.PI) / branchCount;
      
      // Control points for organic curves
      const start = new THREE.Vector3(0, 0, 0);
      const mid = new THREE.Vector3(
        Math.cos(angle) * 1.5 + (Math.random() - 0.5) * 0.4,
        Math.sin(angle) * 1.5 + (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.8
      );
      const end = new THREE.Vector3(
        Math.cos(angle) * 3.2 + (Math.random() - 0.5) * 0.6,
        Math.sin(angle) * 3.2 + (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 1.8
      );

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      
      // Generate render points along curve
      const points = curve.getPoints(24);
      const geom = new THREE.BufferGeometry().setFromPoints(points);

      list.push({
        geometry: geom,
        endPoint: end,
        curve,
        color: TERMINAL_COLORS[i % colorCount],
        pulseProgress: Math.random(),
        pulseSpeed: 0.5 + Math.random() * 0.4
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // A. Parallax Mouse Tracker (global mouse position)
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, globalMouse.current.x * 0.7, 0.05);
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, globalMouse.current.y * 0.7, 0.05);
    
    if (groupRef.current) {
      // Slow idle spin + mouse parallax rotation
      groupRef.current.rotation.y = targetRotation.current.y + (time * 0.025);
      groupRef.current.rotation.x = targetRotation.current.x;
      
      // Floating offset: translation based on mouse moves + subtle sine wave floating
      const targetPosX = globalMouse.current.x * 1.0;
      const targetPosY = globalMouse.current.y * 1.0 + Math.sin(time * 0.6) * 0.25;
      
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05);
    }

    // B. Lerp hover progress state for smooth interaction transitions
    const targetHover = activeState ? 1.0 : 0.0;
    hoverProgress.current = THREE.MathUtils.lerp(hoverProgress.current, targetHover, 0.08);
    const hProg = hoverProgress.current;

    // C. Central Nucleus Inner Core (breathing & hover scaling & opacity)
    if (nucleusRef.current) {
      const nScale = (Math.sin(time * 3.0) * 0.03 + 0.35) * (1.0 + hProg * 0.3);
      nucleusRef.current.scale.set(nScale, nScale, nScale);
      if (nucleusRef.current.material) {
        nucleusRef.current.material.opacity = 0.2 + hProg * 0.35;
      }
    }

    // D. Central Nucleus Outer Halo (breathing & hover scaling & opacity)
    if (nucleusHaloRef.current) {
      const hScale = (Math.sin(time * 1.8) * 0.06 + 0.75) * (1.0 + hProg * 0.3);
      nucleusHaloRef.current.scale.set(hScale, hScale, hScale);
      if (nucleusHaloRef.current.material) {
        nucleusHaloRef.current.material.opacity = 0.05 + hProg * 0.12;
      }
    }

    // E. Soma Cage (breathing, rotation, scaling & opacity)
    if (somaRef.current) {
      const sScale = (Math.sin(time * 1.5) * 0.05 + 1.25) * (1.0 + hProg * 0.25);
      somaRef.current.scale.set(sScale, sScale, sScale);
      somaRef.current.rotation.x = time * 0.08;
      somaRef.current.rotation.y = time * 0.1;
      if (somaRef.current.material) {
        somaRef.current.material.opacity = 0.03 + hProg * 0.07;
      }
    }

    // F. Update Travelling Impulses along branches (smoothly accelerated and brightened on hover)
    if (!instancedPulsesRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    branches.forEach((branch, i) => {
      // Speed multiplier zooms from 1.0x up to 2.5x based on hover
      const speedMultiplier = 1.0 + hProg * 1.5;
      branch.pulseProgress += delta * branch.pulseSpeed * speedMultiplier;
      
      // Clamp to safe range [0.001, 0.999] to prevent getPointAt crash at boundaries
      if (isNaN(branch.pulseProgress) || branch.pulseProgress >= 0.999) {
        branch.pulseProgress = 0.001;
      }
      if (branch.pulseProgress < 0.001) {
        branch.pulseProgress = 0.001;
      }

      try {
        const p = branch.curve.getPointAt(branch.pulseProgress);
        if (p) {
          dummy.position.set(p.x, p.y, p.z);
        }
      } catch (e) {
        // Fallback: reset progress on any curve error
        branch.pulseProgress = 0.1;
        return;
      }
      
      const pulseSize = 0.035 + hProg * 0.035; // scales from 0.035 to 0.07
      dummy.scale.set(pulseSize, pulseSize, pulseSize);
      dummy.updateMatrix();
      instancedPulsesRef.current.setMatrixAt(i, dummy.matrix);

      const brightness = 0.6 + hProg * 1.4; // scales from 0.6 to 2.0
      color.set(branch.color).multiplyScalar(brightness);
      instancedPulsesRef.current.setColorAt(i, color);
    });

    instancedPulsesRef.current.instanceMatrix.needsUpdate = true;
    if (instancedPulsesRef.current.instanceColor) {
      instancedPulsesRef.current.instanceColor.needsUpdate = true;
    }

    // G. Twinkling Background Starfields (independent phases)
    if (starsRefA.current) {
      starsRefA.current.rotation.y = -time * 0.003;
      starsRefA.current.rotation.x = time * 0.0015;
      if (starsRefA.current.material) {
        starsRefA.current.material.opacity = 0.08 + Math.sin(time * 1.2) * 0.06;
      }
    }
    if (starsRefB.current) {
      starsRefB.current.rotation.y = time * 0.002;
      starsRefB.current.rotation.z = -time * 0.001;
      if (starsRefB.current.material) {
        starsRefB.current.material.opacity = 0.06 + Math.cos(time * 0.8) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef}>
      
      {/* 1a. Starfield A (Twinkling Soft Blue/White) */}
      <points ref={starsRefA}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starsA, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#d1d5db"
          size={0.12}
          transparent
          opacity={0.15}
          sizeAttenuation
          map={starTexture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 1b. Starfield B (Twinkling Soft Purple) */}
      <points ref={starsRefB}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starsB, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#b794f4"
          size={0.09}
          transparent
          opacity={0.1}
          sizeAttenuation
          map={starTexture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 2. Central Core Nucleus (Inner bright core) */}
      <mesh ref={nucleusRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={activeState ? "#00cea8" : "#915eff"}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Central Core Halo (Outer soft halo) */}
      <mesh ref={nucleusHaloRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={activeState ? "#00cea8" : "#915eff"}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Outer Soma Cage (Wireframe Icosahedron) */}
      <mesh ref={somaRef}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial
          color="#915eff"
          wireframe
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Branching Dendrites & Terminals */}
      {branches.map((branch, i) => (
        <group key={i}>
          {/* Edge Line segment */}
          <line geometry={branch.geometry}>
            <lineBasicMaterial
              color={branch.color}
              transparent
              opacity={activeState ? 0.12 : 0.05}
              blending={THREE.AdditiveBlending}
            />
          </line>

          {/* Terminal Node Endpoint */}
          <mesh position={branch.endPoint}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial
              color={branch.color}
              transparent
              opacity={activeState ? 0.25 : 0.08}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* 6. Instanced traveling impulses */}
      <instancedMesh
        ref={instancedPulsesRef}
        args={[null, null, branchCount]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </instancedMesh>

    </group>
  );
};

/* ─────────── 3D Network Canvas Container ─────────── */
const NeuralNetworkCanvas = () => {
  const [activeState, setActiveState] = useState(null);

  useEffect(() => {
    const handleHover = (e) => {
      if (e.detail && e.detail.cluster) {
        setActiveState(e.detail.cluster);
      } else {
        setActiveState(null);
      }
    };
    window.addEventListener("neuron-hover", handleHover);
    return () => window.removeEventListener("neuron-hover", handleHover);
  }, []);

  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SingleNeuron activeState={activeState} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default NeuralNetworkCanvas;
