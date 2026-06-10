import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { useInView } from "../hooks/useInView";

// Neural Network Animation for Machine Learning Card
const NeuralNetworkCard = () => {
  const [canvasRef, isInView] = useInView({ rootMargin: "200px 0px" });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return undefined;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    let animationId;
    let time = 0;
    
    const nodes = Array.from({ length: 8 }, (_, i) => ({
      x: (i % 3) * (w / 3) + w / 6,
      y: Math.floor(i / 3) * (h / 3) + h / 4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 3,
      pulse: Math.random() * Math.PI * 2,
    }));
    
    const animate = () => {
      time += 0.01;
      ctx.fillStyle = "rgba(5, 8, 22, 0.1)";
      ctx.fillRect(0, 0, w, h);
      
      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((other) => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.3;
            ctx.strokeStyle = `rgba(145, 94, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });
      
      // Draw and update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 10 || node.x > w - 10) node.vx *= -1;
        if (node.y < 10 || node.y > h - 10) node.vy *= -1;
        
        const pulse = Math.sin(time + node.pulse) * 2 + 4;
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulse + 4);
        gradient.addColorStop(0, "rgba(145, 94, 255, 0.8)");
        gradient.addColorStop(1, "rgba(145, 94, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse + 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "rgba(145, 94, 255, 1)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [canvasRef, isInView]);
  
  return <canvas ref={canvasRef} className="w-full h-24 rounded-lg" width={200} height={96} />;
};

// Glowing AI Core for Generative AI Card
const GlowingAICoreCard = () => {
  const [canvasRef, isInView] = useInView({ rootMargin: "200px 0px" });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return undefined;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    let animationId;
    let time = 0;
    
    const animate = () => {
      time += 0.02;
      ctx.fillStyle = "rgba(5, 8, 22, 0.05)";
      ctx.fillRect(0, 0, w, h);
      
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Multiple concentric glows
      for (let i = 3; i > 0; i--) {
        const radius = 15 + i * 8 + Math.sin(time * 0.5 + i) * 4;
        const alpha = (0.3 / i) * (1 - (radius - 15) / 40);
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, `rgba(0, 206, 168, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(145, 94, 255, ${alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(145, 94, 255, 0)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Core
      const corePulse = Math.sin(time) * 2 + 6;
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, corePulse);
      coreGradient.addColorStop(0, "rgba(0, 206, 168, 1)");
      coreGradient.addColorStop(1, "rgba(0, 206, 168, 0.3)");
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = "rgba(0, 206, 168, 1)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [canvasRef, isInView]);
  
  return <canvas ref={canvasRef} className="w-full h-24 rounded-lg" width={200} height={96} />;
};

// Connected Agent Ecosystem for Agentic AI Card
const AgentEcosystemCard = () => {
  const [canvasRef, isInView] = useInView({ rootMargin: "200px 0px" });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return undefined;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    let animationId;
    let time = 0;
    
    const agents = [
      { x: w / 2, y: h / 2, r: 5, color: "rgba(0, 206, 168, 1)" },
      { x: w / 4, y: h / 4, r: 3, color: "rgba(145, 94, 255, 0.8)" },
      { x: (3 * w) / 4, y: h / 4, r: 3, color: "rgba(145, 94, 255, 0.8)" },
      { x: w / 4, y: (3 * h) / 4, r: 3, color: "rgba(145, 94, 255, 0.8)" },
      { x: (3 * w) / 4, y: (3 * h) / 4, r: 3, color: "rgba(145, 94, 255, 0.8)" },
    ];
    
    const animate = () => {
      time += 0.01;
      ctx.fillStyle = "rgba(5, 8, 22, 0.05)";
      ctx.fillRect(0, 0, w, h);
      
      // Draw connections with pulsing effect
      const centerAgent = agents[0];
      agents.slice(1).forEach((agent, idx) => {
        const pulse = Math.sin(time * 2 + idx) * 0.5 + 0.5;
        const alpha = 0.2 + pulse * 0.3;
        
        ctx.strokeStyle = `rgba(145, 94, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerAgent.x, centerAgent.y);
        ctx.lineTo(agent.x, agent.y);
        ctx.stroke();
      });
      
      // Draw agents with glow
      agents.forEach((agent, idx) => {
        const glowSize = agent.r + Math.sin(time + idx * 0.5) * 2 + 3;
        const glowGradient = ctx.createRadialGradient(agent.x, agent.y, 0, agent.x, agent.y, glowSize);
        glowGradient.addColorStop(0, agent.color.replace("1)", "0.6)"));
        glowGradient.addColorStop(1, agent.color.replace("0.8)", "0)").replace("1)", "0)"));
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, agent.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [canvasRef, isInView]);
  
  return <canvas ref={canvasRef} className="w-full h-24 rounded-lg" width={200} height={96} />;
};

// Premium Focus Card Component
const FocusCard = memo(({ icon, title, description, children, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    lastPointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--spotlight-x", `${lastPointerRef.current.x}px`);
        cardRef.current.style.setProperty("--spotlight-y", `${lastPointerRef.current.y}px`);
      }
      frameRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative h-full"
    >
      {/* Glow effect following cursor */}
      {isHovered && (
        <div
          className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(600px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(145, 94, 255, 0.15), transparent 80%)",
            pointerEvents: "none",
          }}
        />
      )}
      
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative h-full"
      >
        <div
          className={`relative h-full rounded-2xl border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 ${
            isHovered
              ? "bg-gradient-to-br from-white/10 to-white/5 shadow-2xl shadow-violet-accent/20"
              : "bg-gradient-to-br from-white/5 to-white/[0.02] shadow-lg shadow-black/30"
          }`}
          style={{
            boxShadow: isHovered
              ? "0 0 40px rgba(145, 94, 255, 0.3), 0 0 80px rgba(0, 206, 168, 0.1)"
              : "0 0 20px rgba(145, 94, 255, 0.1)",
          }}
        >
          {/* Background glow element */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-accent/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Icon and Title */}
            <div className="mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-accent/30 to-cyan-400/20 flex items-center justify-center mb-4 border border-white/20 backdrop-blur-sm group"
              >
                <span className="text-3xl">{icon}</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            </div>
            
            {/* Canvas Animation */}
            <div className="mb-6 rounded-lg overflow-hidden border border-white/5 bg-black/20">
              {children}
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed flex-grow">{description}</p>
            
            {/* Bottom accent line */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                Explore More →
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// Main FocusAreas Component
const FocusAreas = () => {
  const containerRef = useRef(null);
  
  // Background particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create floating particles
    const particles = Array.from({ length: 20 }, () => {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full pointer-events-none";
      particle.style.cssText = `
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: radial-gradient(circle, rgba(145, 94, 255, 0.8), rgba(0, 206, 168, 0.2));
        opacity: ${Math.random() * 0.5 + 0.2};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float-particle ${Math.random() * 20 + 15}s infinite ease-in-out;
      `;
      container.appendChild(particle);
      return particle;
    });
    
    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);
  
  return (
    <motion.section
      ref={containerRef}
      className="relative w-full py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background gradient blur */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-violet-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>
      
      {/* Title Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.sectionSubText}>My Expertise</p>
        <h2 className={styles.sectionHeadText}>Focus Areas.</h2>
      </motion.div>
      
      {/* Cards Grid - 3 columns centered */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Machine Learning Card */}
          <FocusCard
            icon="🧠"
            title="Machine Learning"
            description="Building predictive systems, exploring intelligent algorithms, and developing practical AI solutions with deep learning frameworks."
            index={0}
          >
            <NeuralNetworkCard />
          </FocusCard>
          
          {/* Generative AI Card */}
          <FocusCard
            icon="✨"
            title="Generative AI"
            description="Working with LLMs, prompt engineering, AI workflows, and modern generative systems to create innovative solutions."
            index={1}
          >
            <GlowingAICoreCard />
          </FocusCard>
          
          {/* Agentic AI Card */}
          <FocusCard
            icon="🤖"
            title="Agentic AI"
            description="Exploring autonomous agents, planning systems, memory architectures, tool usage, and intelligent automation."
            index={2}
          >
            <AgentEcosystemCard />
          </FocusCard>
        </div>
      </div>
      
      {/* Subtle network connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(145, 94, 255, 0.3)" />
            <stop offset="50%" stopColor="rgba(0, 206, 168, 0.2)" />
            <stop offset="100%" stopColor="rgba(145, 94, 255, 0.1)" />
          </linearGradient>
        </defs>
        <line x1="300" y1="100" x2="900" y2="300" stroke="url(#networkGradient)" strokeWidth="1" />
        <line x1="200" y1="200" x2="1000" y2="200" stroke="url(#networkGradient)" strokeWidth="1" />
        <circle cx="300" cy="100" r="4" fill="rgba(145, 94, 255, 0.4)" />
        <circle cx="600" cy="200" r="4" fill="rgba(0, 206, 168, 0.4)" />
        <circle cx="900" cy="300" r="4" fill="rgba(145, 94, 255, 0.4)" />
      </svg>
    </motion.section>
  );
};

export default memo(FocusAreas);
