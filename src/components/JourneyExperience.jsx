import React, { useState, useRef, useMemo, useCallback, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";
import { certifications } from "../constants";
import CanvasLoader from "./Loader";

/* ══════════════════════════════════════════════════════════
   REALM DATA
   ══════════════════════════════════════════════════════════ */

const REALMS = [
  {
    id: 0,
    title: "The Beginning",
    subtitle: "Education & Coding Journey",
    description: "Where it all started — learning Python, Java, and building a foundation in Computer Science.",
    z: 0,
    camPos: [10, 6, 10],
    lookAt: [0, 1, 0],
    color: "#915eff",
  },
  {
    id: 1,
    title: "Algorithm Forest",
    subtitle: "Data Structures & Algorithms",
    description: "Navigating binary trees, sorting algorithms, and optimization techniques.",
    z: -32,
    camPos: [12, 5, -22],
    lookAt: [0, 2, -32],
    color: "#00cea8",
  },
  {
    id: 2,
    title: "Builder City",
    subtitle: "Projects & Applications",
    description: "Building real-world applications — from AI platforms to intelligent systems.",
    z: -64,
    camPos: [10, 10, -54],
    lookAt: [0, 0, -64],
    color: "#f97316",
  },
  {
    id: 3,
    title: "Knowledge Nexus",
    subtitle: "Certifications & Learning",
    description: "Professional certifications and continuous learning. Click a panel to view.",
    z: -96,
    camPos: [0, 4, -83],
    lookAt: [0, 2, -96],
    color: "#56ccf2",
  },
  {
    id: 4,
    title: "AI Command Center",
    subtitle: "Agentic AI Systems",
    description: "Planning, reasoning, memory, tool-calling — the architecture of intelligent agents.",
    z: -128,
    camPos: [0, 7, -115],
    lookAt: [0, 1, -128],
    color: "#bf61ff",
  },
  {
    id: 5,
    title: "Future Vision",
    subtitle: "The Road Ahead",
    description: "Becoming an Agentic AI Engineer — building the future of autonomous intelligence.",
    z: -160,
    camPos: [12, 5, -150],
    lookAt: [0, 3, -160],
    color: "#915eff",
  },
];

/* ══════════════════════════════════════════════════════════
   CAMERA CONTROLLER
   ══════════════════════════════════════════════════════════ */

function CameraController({ activeRealm }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(10, 6, 10));
  const targetLook = useRef(new THREE.Vector3(0, 1, 0));
  const currentLook = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    const r = REALMS[activeRealm];
    targetPos.current.set(r.camPos[0], r.camPos[1], r.camPos[2]);
    targetLook.current.set(r.lookAt[0], r.lookAt[1], r.lookAt[2]);
    camera.position.lerp(targetPos.current, 0.035);
    currentLook.current.lerp(targetLook.current, 0.035);
    camera.lookAt(currentLook.current);
  });

  return null;
}

/* ══════════════════════════════════════════════════════════
   GLOBAL PARTICLES
   ══════════════════════════════════════════════════════════ */

function GlobalParticles() {
  const ref = useRef();
  const count = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = Math.random() * 18 - 2;
      pos[i * 3 + 2] = Math.random() * -180 + 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#915eff" transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM 1 — THE BEGINNING
   ══════════════════════════════════════════════════════════ */

function RealmBeginning({ active }) {
  const groupRef = useRef();
  useFrame((s) => {
    if (!groupRef.current || !active) return;
    groupRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.15) * 0.08;
  });

  const orbs = [
    { pos: [-2.5, 2.5, 0], color: "#3776ab", label: "Python" },
    { pos: [2.5, 2.5, 0], color: "#f89820", label: "Java" },
    { pos: [0, 3.5, -2], color: "#915eff", label: "B.Tech CST" },
  ];

  return (
    <group ref={groupRef} position={[0, 0, REALMS[0].z]}>
      {/* Platform */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6, 0.4, 48]} />
        <meshStandardMaterial color="#0a0820" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.6, 6.1, 64]} />
        <meshStandardMaterial color="#915eff" emissive="#915eff" emissiveIntensity={0.9} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Grid lines on platform */}
      <gridHelper args={[12, 20, "#915eff", "#1a1040"]} position={[0, -0.28, 0]} />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.4} rotationIntensity={0.15}>
          <group position={orb.pos}>
            <mesh>
              <sphereGeometry args={[0.55, 20, 20]} />
              <meshStandardMaterial color={orb.color} emissive={orb.color} emissiveIntensity={0.6} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.7, 12, 12]} />
              <meshStandardMaterial color={orb.color} wireframe transparent opacity={0.15} />
            </mesh>
            {active && (
              <Html center distanceFactor={18} position={[0, -1.1, 0]}>
                <span className="text-[11px] font-bold whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10" style={{ color: orb.color }}>{orb.label}</span>
              </Html>
            )}
          </group>
        </Float>
      ))}

      {/* Connecting beams */}
      {orbs.map((_, i) => {
        const next = orbs[(i + 1) % orbs.length];
        const curr = orbs[i];
        const mid = [(curr.pos[0] + next.pos[0]) / 2, (curr.pos[1] + next.pos[1]) / 2, (curr.pos[2] + next.pos[2]) / 2];
        const len = Math.sqrt((next.pos[0] - curr.pos[0]) ** 2 + (next.pos[1] - curr.pos[1]) ** 2 + (next.pos[2] - curr.pos[2]) ** 2);
        return (
          <mesh key={`beam-${i}`} position={mid}
            lookAt={new THREE.Vector3(...next.pos)}>
            <cylinderGeometry args={[0.015, 0.015, len, 4]} />
            <meshStandardMaterial color="#915eff" emissive="#915eff" emissiveIntensity={0.5} transparent opacity={0.3} />
          </mesh>
        );
      })}

      {/* Central graduation cap symbol */}
      <Float speed={1} floatIntensity={0.3}>
        <group position={[0, 1.2, 0]}>
          <mesh>
            <boxGeometry args={[1.4, 0.08, 1.4]} />
            <meshStandardMaterial color="#1a1040" emissive="#915eff" emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.5, 0.6, 4]} />
            <meshStandardMaterial color="#1a1040" emissive="#915eff" emissiveIntensity={0.2} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM 2 — ALGORITHM FOREST
   ══════════════════════════════════════════════════════════ */

function RealmAlgorithmForest({ active }) {
  const treeRef = useRef();
  useFrame((s) => {
    if (!treeRef.current || !active) return;
    treeRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.1) * 0.05;
  });

  // Binary tree nodes: [x, y, z] positions for a 3-level tree
  const treeNodes = useMemo(() => [
    [0, 5, 0],                       // root
    [-2.5, 3, 0], [2.5, 3, 0],      // level 1
    [-3.8, 1, 0], [-1.2, 1, 0], [1.2, 1, 0], [3.8, 1, 0], // level 2
  ], []);

  const treeEdges = useMemo(() => [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
  ], []);

  // Sorting array bars
  const sortBars = useMemo(() => [3, 7, 2, 5, 8, 1, 6, 4].map((h, i) => ({
    height: h * 0.4,
    x: i * 0.7 - 2.45,
    color: `hsl(${160 + h * 15}, 70%, ${40 + h * 5}%)`,
  })), []);

  return (
    <group ref={treeRef} position={[0, 0, REALMS[1].z]}>
      {/* Platform */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[7, 7, 0.4, 48]} />
        <meshStandardMaterial color="#061210" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.6, 7.1, 64]} />
        <meshStandardMaterial color="#00cea8" emissive="#00cea8" emissiveIntensity={0.8} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Binary tree nodes */}
      {treeNodes.map((pos, i) => (
        <Float key={`node-${i}`} speed={2} floatIntensity={0.15}>
          <mesh position={pos}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#00cea8" emissive="#00cea8" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={pos}>
            <sphereGeometry args={[0.45, 8, 8]} />
            <meshStandardMaterial color="#00cea8" wireframe transparent opacity={0.15} />
          </mesh>
        </Float>
      ))}

      {/* Tree edges */}
      {treeEdges.map(([from, to], i) => {
        const a = treeNodes[from];
        const b = treeNodes[to];
        const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        const len = Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2);
        const dir = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
        return (
          <mesh key={`edge-${i}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.03, 0.03, len, 4]} />
            <meshStandardMaterial color="#00cea8" emissive="#00cea8" emissiveIntensity={0.4} transparent opacity={0.5} />
          </mesh>
        );
      })}

      {/* Sorting visualization */}
      <group position={[6, 0, 0]}>
        {sortBars.map((bar, i) => (
          <Float key={`bar-${i}`} speed={1.5} floatIntensity={0.08}>
            <mesh position={[bar.x, bar.height / 2 - 0.1, 0]}>
              <boxGeometry args={[0.5, bar.height, 0.5]} />
              <meshStandardMaterial color={bar.color} emissive={bar.color} emissiveIntensity={0.3} />
            </mesh>
          </Float>
        ))}
        {active && (
          <Html center distanceFactor={20} position={[0, -1.2, 0]}>
            <span className="text-[10px] font-bold text-emerald-400/80 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-emerald-500/20">Sorting Visualization</span>
          </Html>
        )}
      </group>

      {active && (
        <Html center distanceFactor={22} position={[0, 6.5, 0]}>
          <span className="text-[10px] font-bold text-emerald-400/70 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-emerald-500/20">Binary Tree</span>
        </Html>
      )}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM 3 — BUILDER CITY
   ══════════════════════════════════════════════════════════ */

function RealmBuilderCity({ active }) {
  const buildings = useMemo(() => [
    { pos: [-3, 0, -1], h: 4, w: 1.8, label: "RAG Platform", color: "#f97316" },
    { pos: [0, 0, 1], h: 6, w: 2, label: "AI Agents", color: "#fb923c" },
    { pos: [3, 0, -0.5], h: 3.5, w: 1.6, label: "ML Models", color: "#fbbf24" },
    { pos: [-1.5, 0, -3], h: 2.8, w: 1.4, label: "Automation", color: "#f59e0b" },
    { pos: [2, 0, 3], h: 5, w: 1.5, label: "Data Apps", color: "#ea580c" },
  ], []);

  return (
    <group position={[0, 0, REALMS[2].z]}>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#0a0610" />
      </mesh>
      <gridHelper args={[18, 30, "#f97316", "#1a0f05"]} position={[0, -0.48, 0]} />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <group key={`bld-${i}`} position={[b.pos[0], b.h / 2 - 0.3, b.pos[2]]}>
          {/* Main body */}
          <mesh castShadow>
            <boxGeometry args={[b.w, b.h, b.w]} />
            <meshStandardMaterial color="#0f0a20" emissive={b.color} emissiveIntensity={0.06} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Window emissives */}
          {[...Array(Math.floor(b.h / 0.8))].map((_, row) => (
            <React.Fragment key={`win-${row}`}>
              <mesh position={[b.w / 2 + 0.01, -b.h / 2 + 0.6 + row * 0.8, 0]}>
                <planeGeometry args={[0.01, 0.3, 0.4]} />
                <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={1.2} />
              </mesh>
              <mesh position={[0, -b.h / 2 + 0.6 + row * 0.8, b.w / 2 + 0.01]}>
                <planeGeometry args={[0.4, 0.3]} />
                <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={1.2} />
              </mesh>
            </React.Fragment>
          ))}
          {/* Roof accent */}
          <mesh position={[0, b.h / 2 + 0.05, 0]}>
            <boxGeometry args={[b.w + 0.1, 0.08, b.w + 0.1]} />
            <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.6} />
          </mesh>
          {active && (
            <Html center distanceFactor={20} position={[0, b.h / 2 + 0.8, 0]}>
              <span className="text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-orange-500/20" style={{ color: b.color }}>{b.label}</span>
            </Html>
          )}
        </group>
      ))}

      {/* Connection beams between tallest buildings */}
      <mesh position={[0, 5.5, 0.25]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 6, 4]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM 4 — KNOWLEDGE NEXUS
   ══════════════════════════════════════════════════════════ */

function RealmKnowledgeNexus({ active, onCertClick }) {
  const groupRef = useRef();

  useFrame((s) => {
    if (!groupRef.current || !active) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * 0.08;
  });

  const certPositions = useMemo(() =>
    certifications.map((_, i) => {
      const angle = (i / certifications.length) * Math.PI * 2;
      const radius = 4;
      return [Math.cos(angle) * radius, 2 + Math.sin(angle * 2) * 0.5, Math.sin(angle) * radius];
    }), []);

  return (
    <group position={[0, 0, REALMS[3].z]}>
      {/* Central core */}
      <Float speed={1.5} floatIntensity={0.3}>
        <mesh position={[0, 2, 0]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#56ccf2" emissive="#56ccf2" emissiveIntensity={1} transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#56ccf2" wireframe transparent opacity={0.2} />
        </mesh>
        <pointLight position={[0, 2, 0]} color="#56ccf2" intensity={3} distance={12} />
      </Float>

      {/* Platform ring */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 6, 64]} />
        <meshStandardMaterial color="#56ccf2" emissive="#56ccf2" emissiveIntensity={0.6} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting certificate panels */}
      <group ref={groupRef}>
        {certifications.map((cert, i) => (
          <group key={`cert-${i}`} position={certPositions[i]}>
            {/* Panel background */}
            <mesh
              onClick={(e) => { e.stopPropagation(); onCertClick(i); }}
              onPointerOver={() => { document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { document.body.style.cursor = "default"; }}
            >
              <planeGeometry args={[2.2, 1.5]} />
              <meshStandardMaterial color="#0a0820" emissive="#56ccf2" emissiveIntensity={0.08} side={THREE.DoubleSide} />
            </mesh>
            {/* Glowing border */}
            <mesh>
              <planeGeometry args={[2.35, 1.65]} />
              <meshStandardMaterial color="#56ccf2" emissive="#56ccf2" emissiveIntensity={0.8} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
            {/* Corner accents */}
            {[[-1, 0.65], [1, 0.65], [-1, -0.65], [1, -0.65]].map(([cx, cy], j) => (
              <mesh key={`corner-${j}`} position={[cx, cy, 0.01]}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#56ccf2" emissive="#56ccf2" emissiveIntensity={2} />
              </mesh>
            ))}
            {active && (
              <Html center distanceFactor={16} position={[0, 0, 0.1]}>
                <div className="text-center pointer-events-none">
                  <p className="text-[11px] font-bold text-cyan-300 whitespace-nowrap">{cert.title}</p>
                  <p className="text-[9px] text-cyan-300/50 mt-0.5">{cert.organization}</p>
                </div>
              </Html>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM 5 — AGENTIC AI COMMAND CENTER
   ══════════════════════════════════════════════════════════ */

function RealmAgenticCommand({ active }) {
  const orbitRef = useRef();

  useFrame((s) => {
    if (!orbitRef.current || !active) return;
    orbitRef.current.rotation.y = s.clock.elapsedTime * 0.12;
  });

  const agents = useMemo(() => [
    { label: "Planning", color: "#a855f7", angle: 0 },
    { label: "Memory", color: "#ec4899", angle: 1 },
    { label: "Tool Calling", color: "#3b82f6", angle: 2 },
    { label: "Reasoning", color: "#10b981", angle: 3 },
    { label: "Automation", color: "#f59e0b", angle: 4 },
  ].map((a) => ({
    ...a,
    pos: [
      Math.cos((a.angle / 5) * Math.PI * 2) * 5,
      2 + Math.sin((a.angle / 5) * Math.PI * 4) * 0.5,
      Math.sin((a.angle / 5) * Math.PI * 2) * 5,
    ],
  })), []);

  return (
    <group position={[0, 0, REALMS[4].z]}>
      {/* Central hub */}
      <Float speed={1} floatIntensity={0.2}>
        <mesh position={[0, 2, 0]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#bf61ff" emissive="#bf61ff" emissiveIntensity={0.4} transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#bf61ff" wireframe transparent opacity={0.12} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <icosahedronGeometry args={[1.8, 0]} />
          <meshStandardMaterial color="#915eff" wireframe transparent opacity={0.06} />
        </mesh>
        <pointLight position={[0, 2, 0]} color="#bf61ff" intensity={4} distance={15} />
      </Float>

      {/* Platform */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 7, 64]} />
        <meshStandardMaterial color="#bf61ff" emissive="#bf61ff" emissiveIntensity={0.5} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Orbiting agent nodes */}
      <group ref={orbitRef}>
        {agents.map((agent, i) => (
          <group key={`agent-${i}`}>
            {/* Node */}
            <Float speed={2} floatIntensity={0.15}>
              <mesh position={agent.pos}>
                <dodecahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={0.7} />
              </mesh>
              <mesh position={agent.pos}>
                <dodecahedronGeometry args={[0.65, 0]} />
                <meshStandardMaterial color={agent.color} wireframe transparent opacity={0.15} />
              </mesh>
            </Float>
            {/* Connection to center */}
            {(() => {
              const dir = new THREE.Vector3(agent.pos[0], agent.pos[1] - 2, agent.pos[2]).normalize();
              const len = new THREE.Vector3(agent.pos[0], agent.pos[1] - 2, agent.pos[2]).length();
              const mid = [agent.pos[0] / 2, (agent.pos[1] + 2) / 2, agent.pos[2] / 2];
              const up = new THREE.Vector3(0, 1, 0);
              const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
              return (
                <mesh position={mid} quaternion={quat}>
                  <cylinderGeometry args={[0.015, 0.015, len, 4]} />
                  <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={0.5} transparent opacity={0.3} />
                </mesh>
              );
            })()}
            {/* Label */}
            {active && (
              <Html center distanceFactor={18} position={[agent.pos[0], agent.pos[1] - 0.9, agent.pos[2]]}>
                <span className="text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10" style={{ color: agent.color }}>{agent.label}</span>
              </Html>
            )}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM 6 — FUTURE VISION
   ══════════════════════════════════════════════════════════ */

function RealmFutureVision({ active }) {
  const spireRef = useRef();
  useFrame((s) => {
    if (!spireRef.current || !active) return;
    spireRef.current.children[1].material.emissiveIntensity = 0.8 + Math.sin(s.clock.elapsedTime * 2) * 0.4;
  });

  const towers = useMemo(() => {
    const t = [];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const r = 3 + Math.random() * 4;
      const h = 1.5 + Math.random() * 5;
      t.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        h,
        w: 0.6 + Math.random() * 0.8,
      });
    }
    return t;
  }, []);

  return (
    <group position={[0, 0, REALMS[5].z]}>
      {/* Ground */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050510" />
      </mesh>
      <gridHelper args={[20, 40, "#915eff", "#0a0520"]} position={[0, -0.48, 0]} />

      {/* City towers */}
      {towers.map((t, i) => (
        <group key={`tower-${i}`} position={[t.x, t.h / 2 - 0.3, t.z]}>
          <mesh>
            <boxGeometry args={[t.w, t.h, t.w]} />
            <meshStandardMaterial color="#080418" emissive="#915eff" emissiveIntensity={0.04 + (i % 3) * 0.02} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Window strips */}
          {[...Array(Math.floor(t.h / 0.6))].map((_, row) => (
            <mesh key={`tw-${row}`} position={[t.w / 2 + 0.01, -t.h / 2 + 0.4 + row * 0.6, 0]}>
              <planeGeometry args={[0.01, 0.15, 0.3]} />
              <meshStandardMaterial color="#915eff" emissive="#915eff" emissiveIntensity={0.8 + Math.random() * 0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Central spire */}
      <group ref={spireRef} position={[0, 0, 0]}>
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.15, 0.5, 9, 6]} />
          <meshStandardMaterial color="#0a0520" emissive="#915eff" emissiveIntensity={0.1} metalness={0.7} />
        </mesh>
        {/* Beacon */}
        <mesh position={[0, 9.2, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color="#915eff" emissive="#915eff" emissiveIntensity={1.2} />
        </mesh>
        <pointLight position={[0, 9.2, 0]} color="#915eff" intensity={6} distance={20} />
        {/* Spire rings */}
        {[3, 5, 7].map((y) => (
          <mesh key={`ring-${y}`} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.5, 16]} />
            <meshStandardMaterial color="#915eff" emissive="#915eff" emissiveIntensity={0.6} transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {active && (
        <Html center distanceFactor={25} position={[0, 10.5, 0]}>
          <span className="text-[14px] font-extrabold whitespace-nowrap px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-violet-500/30 text-violet-400 tracking-wider">AGENTIC AI ENGINEER</span>
        </Html>
      )}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════
   REALM BEACONS (distant markers)
   ══════════════════════════════════════════════════════════ */

function RealmBeacons({ activeRealm }) {
  return (
    <>
      {REALMS.map((r, i) => {
        if (Math.abs(activeRealm - i) <= 1) return null;
        return (
          <mesh key={`beacon-${i}`} position={[0, 3, r.z]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color={r.color} emissive={r.color} emissiveIntensity={1.5} />
          </mesh>
        );
      })}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   POST-PROCESSING
   ══════════════════════════════════════════════════════════ */

function PostFX() {
  return (
    <EffectComposer>
      <Bloom intensity={0.6} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
    </EffectComposer>
  );
}

/* ══════════════════════════════════════════════════════════
   SCENE COMPOSITION
   ══════════════════════════════════════════════════════════ */

function JourneyScene({ activeRealm, onCertClick }) {
  return (
    <>
      <fog attach="fog" args={["#050816", 20, 45]} />
      <ambientLight color="#332255" intensity={0.3} />
      <directionalLight position={[10, 15, 5]} color="#915eff" intensity={0.4} />
      <hemisphereLight args={["#6633cc", "#050816", 0.2]} />

      <CameraController activeRealm={activeRealm} />
      <GlobalParticles />

      {/* Realms — only render detailed content when near */}
      <group visible={Math.abs(activeRealm - 0) <= 1}>
        <RealmBeginning active={activeRealm === 0} />
      </group>
      <group visible={Math.abs(activeRealm - 1) <= 1}>
        <RealmAlgorithmForest active={activeRealm === 1} />
      </group>
      <group visible={Math.abs(activeRealm - 2) <= 1}>
        <RealmBuilderCity active={activeRealm === 2} />
      </group>
      <group visible={Math.abs(activeRealm - 3) <= 1}>
        <RealmKnowledgeNexus active={activeRealm === 3} onCertClick={onCertClick} />
      </group>
      <group visible={Math.abs(activeRealm - 4) <= 1}>
        <RealmAgenticCommand active={activeRealm === 4} />
      </group>
      <group visible={Math.abs(activeRealm - 5) <= 1}>
        <RealmFutureVision active={activeRealm === 5} />
      </group>

      <RealmBeacons activeRealm={activeRealm} />
      <PostFX />
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   CERTIFICATE VIEWER MODAL
   ══════════════════════════════════════════════════════════ */

function CertViewer({ cert, onClose }) {
  if (!cert) return null;

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-30 flex items-center justify-center bg-[#050816]/90 backdrop-blur-md rounded-3xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.6, rotateY: -90, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.6, rotateY: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          style={{ perspective: "1200px" }}
          className="relative w-[90%] max-w-3xl max-h-[80%] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-tertiary/90 backdrop-blur-lg rounded-t-2xl px-5 py-3 border border-white/5 border-b-0">
            <div className="min-w-0">
              <h3 className="text-white font-bold text-[16px] truncate">{cert.title}</h3>
              <p className="text-secondary text-[12px] truncate">{cert.organization}{cert.subtitle ? ` — ${cert.subtitle}` : ""}</p>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <a href={cert.file} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer" aria-label="Full resolution">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </a>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/20 transition-colors cursor-pointer" aria-label="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-hidden bg-[#0a0820] border border-white/5 border-t-0 rounded-b-2xl">
            {cert.type === "image" ? (
              <img src={cert.file} alt={cert.title} className="w-full h-full object-contain" draggable={false} />
            ) : (
              <iframe src={`${cert.file}#toolbar=0&navpanes=0`} title={cert.title} className="w-full h-full min-h-[400px] sm:min-h-[500px]" style={{ border: "none" }} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   HUD OVERLAY
   ══════════════════════════════════════════════════════════ */

function JourneyHUD({ activeRealm, onRealmChange }) {
  const realm = REALMS[activeRealm];

  return (
    <>
      {/* Realm title — top left */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRealm}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-5 left-5 z-10 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: realm.color, boxShadow: `0 0 8px ${realm.color}` }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: realm.color }}>
              Realm {activeRealm + 1} of {REALMS.length}
            </span>
          </div>
          <h3 className="text-white font-bold text-[20px] sm:text-[24px] leading-tight">{realm.title}</h3>
          <p className="text-secondary/50 text-[12px] mt-0.5">{realm.subtitle}</p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots — right side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
        {REALMS.map((r, i) => (
          <button
            key={i}
            onClick={() => onRealmChange(i)}
            className="group relative cursor-pointer"
            aria-label={`Go to ${r.title}`}
          >
            <div
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                i === activeRealm
                  ? "scale-[1.3]"
                  : "bg-transparent border-white/25 hover:border-white/60"
              }`}
              style={i === activeRealm ? {
                backgroundColor: r.color,
                borderColor: r.color,
                boxShadow: `0 0 10px ${r.color}60`,
              } : {}}
            />
            {/* Tooltip */}
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-white/0 group-hover:text-white/70 font-medium whitespace-nowrap transition-all duration-200 pointer-events-none bg-black/50 px-2 py-0.5 rounded group-hover:opacity-100 opacity-0">
              {r.title}
            </span>
          </button>
        ))}
      </div>

      {/* Description — bottom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRealm}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none w-[90%] max-w-lg"
        >
          <p className="text-secondary/40 text-[12px] sm:text-[13px] leading-[20px]">{realm.description}</p>
          <p className="text-white/15 text-[10px] mt-1.5 hidden sm:block">← A / D or Arrow Keys →</p>
          <p className="text-white/15 text-[10px] mt-1.5 sm:hidden">← Swipe →</p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */

const JourneyExperience = () => {
  const [activeRealm, setActiveRealm] = useState(0);
  const [certIndex, setCertIndex] = useState(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const wheelLock = useRef(false);
  const touchStartX = useRef(0);

  // Lazy mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const goNext = useCallback(() => {
    setActiveRealm((r) => Math.min(r + 1, REALMS.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setActiveRealm((r) => Math.max(r - 1, 0));
  }, []);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") goNext();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Mouse wheel (with debounce)
  const handleWheel = useCallback((e) => {
    if (wheelLock.current) return;
    wheelLock.current = true;
    setTimeout(() => { wheelLock.current = false; }, 700);
    if (e.deltaY > 0) goNext();
    else goPrev();
  }, [goNext, goPrev]);

  // Touch swipe
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  const handleCertClick = useCallback((index) => {
    setCertIndex(index);
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          An interactive 3D experience
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Journey to Agentic AI Engineer.
        </h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-secondary text-[15px] max-w-2xl mx-auto text-center leading-[26px] mb-10"
      >
        Navigate through six realms that trace my path from student to future Agentic AI Engineer.
        Use arrow keys, scroll, or swipe to explore.
      </motion.p>

      {/* Journey Viewport */}
      <div
        ref={containerRef}
        className="h-[560px] sm:h-[620px] w-full rounded-3xl bg-[#050816]/95 border-2 border-violet-accent/30 relative overflow-hidden shadow-[0_0_60px_rgba(145,94,255,0.12)]"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isVisible && (
          <>
            <Canvas
              camera={{ position: [10, 6, 10], fov: 55, near: 0.1, far: 200 }}
              gl={{ antialias: true, alpha: false }}
              onCreated={({ gl }) => { gl.setClearColor("#050816"); }}
              dpr={[1, 1.5]}
            >
              <Suspense fallback={<CanvasLoader />}>
                <JourneyScene activeRealm={activeRealm} onCertClick={handleCertClick} />
              </Suspense>
            </Canvas>

            <JourneyHUD activeRealm={activeRealm} onRealmChange={setActiveRealm} />

            {/* Certificate viewer */}
            {certIndex !== null && (
              <CertViewer
                cert={certifications[certIndex]}
                onClose={() => setCertIndex(null)}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(JourneyExperience, "playground");
