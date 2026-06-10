import { memo, useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useInView } from "../../hooks/useInView";

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
const SingleNeuron = ({ activeState, active }) => {
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
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  // Generate glowing star texture once
  const starTexture = useMemo(() => createCircleTexture(), []);
  const pulseGeom = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const pulseMat = useMemo(() => new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  }), []);

  useEffect(() => {
    return () => {
      starTexture.dispose();
      pulseGeom.dispose();
      pulseMat.dispose();
    };
  }, [starTexture, pulseGeom, pulseMat]);

  // Listen to global mouse events to support mouse parallax even when Canvas is pointer-events-none
  useEffect(() => {
    if (!active) return undefined;

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

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [active]);

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

      // Precompute points along the curve for fast lookup in useFrame (runs 8x per frame)
      const precomputedPoints = curve.getPoints(100);

      list.push({
        geometry: geom,
        endPoint: end,
        curve,
        precomputedPoints,
        color: TERMINAL_COLORS[i % colorCount],
        pulseProgress: Math.random(),
        pulseSpeed: 0.5 + Math.random() * 0.4
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (!active) return;

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

    branches.forEach((branch, i) => {
      // Speed multiplier zooms from 1.0x up to 2.5x based on hover
      const speedMultiplier = 1.0 + hProg * 1.5;
      branch.pulseProgress += delta * branch.pulseSpeed * speedMultiplier;
      
      // Keep inside [0.0, 1.0] dynamically
      if (isNaN(branch.pulseProgress) || branch.pulseProgress >= 1.0) {
        branch.pulseProgress = 0.0;
      }

      const pointsLen = branch.precomputedPoints.length;

      // Pulse 1 progress
      const progress1 = branch.pulseProgress;
      const idx1 = Math.min(pointsLen - 1, Math.max(0, Math.floor(progress1 * pointsLen)));
      const p1 = branch.precomputedPoints[idx1];

      // Pulse 2 progress (offset by 0.5 phase)
      const progress2 = (branch.pulseProgress + 0.5) % 1.0;
      const idx2 = Math.min(pointsLen - 1, Math.max(0, Math.floor(progress2 * pointsLen)));
      const p2 = branch.precomputedPoints[idx2];

      const pulseSize = 0.035 + hProg * 0.035; // scales from 0.035 to 0.07
      const brightness = 0.6 + hProg * 1.4; // scales from 0.6 to 2.0
      color.set(branch.color).multiplyScalar(brightness);

      // Render Pulse 1 (instance index i * 2)
      if (p1) {
        dummy.position.set(p1.x, p1.y, p1.z);
        dummy.scale.set(pulseSize, pulseSize, pulseSize);
        dummy.updateMatrix();
        instancedPulsesRef.current.setMatrixAt(i * 2, dummy.matrix);
        instancedPulsesRef.current.setColorAt(i * 2, color);
      }

      // Render Pulse 2 (instance index i * 2 + 1)
      if (p2) {
        dummy.position.set(p2.x, p2.y, p2.z);
        const pulseSize2 = pulseSize * 0.72; // slightly smaller secondary pulse
        dummy.scale.set(pulseSize2, pulseSize2, pulseSize2);
        dummy.updateMatrix();
        instancedPulsesRef.current.setMatrixAt(i * 2 + 1, dummy.matrix);
        
        // Secondary pulse has slightly lower brightness for dynamics
        const color2 = color.clone().multiplyScalar(0.7);
        instancedPulsesRef.current.setColorAt(i * 2 + 1, color2);
      }
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
              opacity={activeState ? 0.35 : 0.16}
              blending={THREE.AdditiveBlending}
            />
          </line>

          {/* Terminal Node Endpoint */}
          <mesh position={branch.endPoint}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial
              color={branch.color}
              transparent
              opacity={activeState ? 0.65 : 0.22}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* 6. Instanced traveling impulses */}
      <instancedMesh
        ref={instancedPulsesRef}
        args={[pulseGeom, pulseMat, branchCount * 2]}
      />

    </group>
  );
};

/* ─────────── 3D Network Canvas Container ─────────── */
const NeuralNetworkCanvas = () => {
  const [activeState, setActiveState] = useState(null);
  const [containerRef, isInView] = useInView({ rootMargin: "300px 0px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const match = window.matchMedia("(max-width: 768px)").matches || 
                    ('ontouchstart' in window) || 
                    (navigator.maxTouchPoints > 0);
      setIsMobile(match);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div ref={containerRef} className="w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={isMobile ? 1.0 : [1, 1.5]}
        frameloop={isInView ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SingleNeuron activeState={activeState} active={isInView} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default memo(NeuralNetworkCanvas);
