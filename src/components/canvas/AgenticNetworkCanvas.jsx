import { memo, useEffect, useRef } from "react";
import { useInView } from "../../hooks/useInView";

/**
 * Agentic Network Canvas — Pure CSS/Canvas2D implementation.
 * No WebGL/R3F context needed, so it won't conflict with Three.js scenes.
 * Renders floating nodes connected by gradient lines, reacting to cursor.
 */
const AgenticNetworkCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const [containerRef, isInView] = useInView({ rootMargin: "300px 0px" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return undefined;
    const ctx = canvas.getContext("2d");

    if (nodesRef.current.length === 0) {
      const nodeCount = 18;
      nodesRef.current = Array.from({ length: nodeCount }, (_, i) => {
        const baseX = Math.random();
        const baseY = Math.random();
        return {
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          speed: 0.2 + Math.random() * 0.4,
          offset: Math.random() * Math.PI * 2,
          radius: 1.5 + Math.random() * 2.5,
          color: i % 3 === 0 ? "#915eff" : i % 3 === 1 ? "#00cea8" : "#56ccf2",
        };
      });
    }

    const nodes = nodesRef.current;

    const connectionThreshold = 0.28;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.current.x = e.touches[0].clientX / window.innerWidth;
        mouse.current.y = e.touches[0].clientY / window.innerHeight;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });


    // Throttle drawing to reduce CPU/GPU load while keeping animation smooth.
    // Target ~30fps on average (33ms per frame). Visuals remain the same.
    let lastDraw = 0;
    const targetFrameMs = 1000 / 30;

    const animate = (time) => {
      const now = time || performance.now();
      if (now - lastDraw >= targetFrameMs) {
        lastDraw = now;

        const t = now * 0.001;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        ctx.clearRect(0, 0, w, h);

        // Update node positions
        nodes.forEach((node) => {
          const cursorInf = 0.04;
          node.x =
            node.baseX +
            Math.sin(t * node.speed + node.offset) * 0.06 +
            (mouse.current.x - 0.5) * cursorInf;
          node.y =
            node.baseY +
            Math.cos(t * node.speed * 0.7 + node.offset) * 0.05 +
            (mouse.current.y - 0.5) * cursorInf;
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionThreshold) {
              const alpha = (1 - dist / connectionThreshold) * 0.15;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
              ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
              ctx.strokeStyle = `rgba(145, 94, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.x * w, node.y * h, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Glow
          ctx.beginPath();
          ctx.arc(node.x * w, node.y * h, node.radius * 3, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(
            node.x * w,
            node.y * h,
            0,
            node.x * w,
            node.y * h,
            node.radius * 3
          );
          grad.addColorStop(0, node.color + "20");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }

      // Keep scheduling; pause work when tab is hidden.
      if (!document.hidden) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) {
        // Resume animation (throttling still applies).
        animRef.current = requestAnimationFrame(animate);
      }
    };

    // Start
    document.addEventListener("visibilitychange", handleVisibility);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isInView]);

  return (
    <div ref={containerRef} className="agentic-network-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default memo(AgenticNetworkCanvas);
