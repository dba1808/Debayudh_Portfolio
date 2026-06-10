import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const GRID_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const Game = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0); // number of data points eaten
  const [accuracy, setAccuracy] = useState(0); // 0% to 100%
  const [loss, setLoss] = useState(1.000); // starts at 1.000, drops to ~0.005
  const [epochs, setEpochs] = useState(0); // steps taken
  
  // Game states stored in ref to prevent re-renders breaking the game loop
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const dirRef = useRef({ x: 1, y: 0 }); // start moving right
  const dataPointRef = useRef({ x: 5, y: 5 });
  const obstaclesRef = useRef([]); // overfitting anomalies (red dots)
  const particlesRef = useRef([]); // custom backpropagation particles
  const nextDirRef = useRef({ x: 1, y: 0 }); // buffer to prevent rapid self-collision

  // Sound Synth Helper (Web Audio API)
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === "eat") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "crash") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "win") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        osc.frequency.setValueAtTime(900, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      // AudioContext blocked or unsupported
    }
  };

  // Generate random grid coordinates avoiding snake & existing items
  const getRandomCoords = () => {
    const maxX = CANVAS_WIDTH / GRID_SIZE;
    const maxY = CANVAS_HEIGHT / GRID_SIZE;
    let newCoords;
    let isValid = false;

    while (!isValid) {
      newCoords = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
      };

      // Check if coordinates overlap with snake body
      const overlapsSnake = snakeRef.current.some(
        (seg) => seg.x === newCoords.x && seg.y === newCoords.y
      );

      // Check overlap with obstacles
      const overlapsObstacle = obstaclesRef.current.some(
        (obs) => obs.x === newCoords.x && obs.y === newCoords.y
      );

      if (!overlapsSnake && !overlapsObstacle) {
        isValid = true;
      }
    }
    return newCoords;
  };

  // Reset Game States
  const startGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    obstaclesRef.current = [];
    particlesRef.current = [];
    
    // Spawn initial data point
    dataPointRef.current = getRandomCoords();
    
    // Spawn 2 initial static obstacles (overfitting risks)
    for (let i = 0; i < 3; i++) {
      obstaclesRef.current.push(getRandomCoords());
    }

    setScore(0);
    setAccuracy(0);
    setLoss(1.000);
    setEpochs(0);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
  };

  // Key Event Handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || gameOver || gameWon) return;

      const currentDir = dirRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir.y === 0) nextDirRef.current = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir.y === 0) nextDirRef.current = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir.x === 0) nextDirRef.current = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir.x === 0) nextDirRef.current = { x: 1, y: 0 };
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, gameWon]);

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver || gameWon) return;

    let frameId;
    let lastTime = 0;
    const speed = 120; // ms per frame update (8 grid moves per second)

    const updatePhysics = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed > speed) {
        lastTime = timestamp;

        // Applybuffered direction change
        dirRef.current = nextDirRef.current;
        const head = { ...snakeRef.current[0] };
        const d = dirRef.current;
        
        const nextHead = {
          x: head.x + d.x,
          y: head.y + d.y,
        };

        // Grid boundaries
        const maxX = CANVAS_WIDTH / GRID_SIZE;
        const maxY = CANVAS_HEIGHT / GRID_SIZE;

        // Check Wall Collisions
        if (
          nextHead.x < 0 ||
          nextHead.x >= maxX ||
          nextHead.y < 0 ||
          nextHead.y >= maxY
        ) {
          playSound("crash");
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        // Check Self Collision
        const selfCrash = snakeRef.current.some(
          (seg) => seg.x === nextHead.x && seg.y === nextHead.y
        );
        if (selfCrash) {
          playSound("crash");
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        // Check Obstacle/Overfitting Collision
        const obstacleCrash = obstaclesRef.current.some(
          (obs) => obs.x === nextHead.x && obs.y === nextHead.y
        );
        if (obstacleCrash) {
          playSound("crash");
          setGameOver(true);
          setIsPlaying(false);
          return;
        }

        // Increment Epochs
        setEpochs((prev) => prev + 1);

        // Move Snake
        snakeRef.current.unshift(nextHead);

        // Check Food / DataPoint Consumption
        if (nextHead.x === dataPointRef.current.x && nextHead.y === dataPointRef.current.y) {
          playSound("eat");
          
          // Trigger backprop particles from tail back to head
          const tail = snakeRef.current[snakeRef.current.length - 1];
          for (let i = 0; i < 15; i++) {
            particlesRef.current.push({
              x: nextHead.x * GRID_SIZE + GRID_SIZE / 2,
              y: nextHead.y * GRID_SIZE + GRID_SIZE / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: Math.random() * 3 + 2,
              alpha: 1.0,
              color: "#915eff",
            });
          }

          const newScore = score + 1;
          setScore(newScore);

          // Neural statistics updates
          const newAccuracy = Math.min(100, Math.floor(newScore * 6.7));
          const newLoss = Math.max(0.005, Number((1.000 / (1.000 + newScore * 0.4)).toFixed(3)));
          
          setAccuracy(newAccuracy);
          setLoss(newLoss);

          if (newAccuracy >= 100) {
            playSound("win");
            setGameWon(true);
            setIsPlaying(false);
            return;
          }

          // Spawn new food & another obstacle to make game harder
          dataPointRef.current = getRandomCoords();
          obstaclesRef.current.push(getRandomCoords());
        } else {
          // Normal step (remove tail)
          snakeRef.current.pop();
        }
      }

      // Physics/Particles update every frame (independent of grid speed)
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
        }
      });

      // Canvas Rendering
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        
        // Clear background with theme-like deep dark blue
        ctx.fillStyle = "#0c0a24";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Matrix grid lines
        ctx.strokeStyle = "rgba(145, 94, 255, 0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, CANVAS_HEIGHT);
          ctx.stroke();
        }
        for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(CANVAS_WIDTH, y);
          ctx.stroke();
        }

        // Draw Particles (Backprop waves)
        particlesRef.current.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        });

        // Draw Obstacles (Overfitting nodes - Red blinking)
        obstaclesRef.current.forEach((obs) => {
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#ff4d4d";
          ctx.fillStyle = `rgba(255, 77, 77, ${0.7 + Math.sin(Date.now() / 100) * 0.3})`;
          ctx.beginPath();
          ctx.arc(
            obs.x * GRID_SIZE + GRID_SIZE / 2,
            obs.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2.2,
            0,
            Math.PI * 2
          );
          ctx.fill();
          
          // Draw "X" inside obstacle
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const offset = 4;
          const cx = obs.x * GRID_SIZE + GRID_SIZE / 2;
          const cy = obs.y * GRID_SIZE + GRID_SIZE / 2;
          ctx.moveTo(cx - offset, cy - offset);
          ctx.lineTo(cx + offset, cy + offset);
          ctx.moveTo(cx + offset, cy - offset);
          ctx.lineTo(cx - offset, cy + offset);
          ctx.stroke();
          ctx.restore();
        });

        // Draw Food / Data Point (Green Glow)
        const food = dataPointRef.current;
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00cea8";
        ctx.fillStyle = "#00cea8";
        ctx.beginPath();
        ctx.arc(
          food.x * GRID_SIZE + GRID_SIZE / 2,
          food.y * GRID_SIZE + GRID_SIZE / 2,
          GRID_SIZE / 2.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        // Draw Neural Net Snake
        snakeRef.current.forEach((seg, index) => {
          const isHead = index === 0;
          const isTail = index === snakeRef.current.length - 1;
          
          const cx = seg.x * GRID_SIZE + GRID_SIZE / 2;
          const cy = seg.y * GRID_SIZE + GRID_SIZE / 2;

          ctx.save();
          
          // Connect to the next node in network with a synapatic line
          if (index < snakeRef.current.length - 1) {
            const nextSeg = snakeRef.current[index + 1];
            ctx.beginPath();
            ctx.strokeStyle = isHead ? "rgba(145, 94, 255, 0.8)" : "rgba(0, 206, 168, 0.4)";
            ctx.lineWidth = 2.5;
            ctx.moveTo(cx, cy);
            ctx.lineTo(
              nextSeg.x * GRID_SIZE + GRID_SIZE / 2,
              nextSeg.y * GRID_SIZE + GRID_SIZE / 2
            );
            ctx.stroke();
          }

          // Node circles
          ctx.beginPath();
          ctx.arc(cx, cy, isHead ? GRID_SIZE / 2.1 : GRID_SIZE / 2.8, 0, Math.PI * 2);
          
          if (isHead) {
            ctx.fillStyle = "#915eff";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#915eff";
          } else if (isTail) {
            ctx.fillStyle = "#8a3fd3";
          } else {
            ctx.fillStyle = "#00cea8";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#00cea8";
          }
          ctx.fill();

          // Outer circle/synapse outline
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        });
      }

      frameId = requestAnimationFrame(updatePhysics);
    };

    frameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, gameOver, gameWon, score]);

  // Mobile Direction Buttons Handler
  const handleMobilePress = (dir) => {
    if (!isPlaying || gameOver || gameWon) return;
    const currentDir = dirRef.current;
    
    switch (dir) {
      case "up":
        if (currentDir.y === 0) nextDirRef.current = { x: 0, y: -1 };
        break;
      case "down":
        if (currentDir.y === 0) nextDirRef.current = { x: 0, y: 1 };
        break;
      case "left":
        if (currentDir.x === 0) nextDirRef.current = { x: -1, y: 0 };
        break;
      case "right":
        if (currentDir.x === 0) nextDirRef.current = { x: 1, y: 0 };
        break;
      default:
        break;
    }
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Interactive Playground</p>
        <h2 className={styles.sectionHeadText}>Neural Playground.</h2>
      </motion.div>

      <div className='w-full flex flex-col xl:flex-row gap-8 mt-4 items-stretch'>
        {/* Left Side: Game HUD and Controls */}
        <motion.div
          variants={fadeIn("right", "spring", 0.1, 1)}
          className='flex-[0.8] bg-tertiary p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[400px]'
        >
          <div className='absolute -top-[50px] -left-[50px] w-[200px] h-[200px] bg-violet-accent/5 rounded-full blur-[80px]' />

          <div>
            <h3 className='text-white font-bold text-[22px] mb-3 flex items-center gap-2'>
              <span>🎮</span> Neural Net Train Simulator
            </h3>
            <p className='text-secondary text-[14.5px] leading-[24px] mb-6'>
              Guide the **neural network snake** to absorb **green data points** to increase model accuracy and minimize validation loss. Avoid hitting the borders, the network body, or **red overfitting anomalies**!
            </p>

            {/* Neural Dashboard */}
            <div className='grid grid-cols-3 gap-3 mb-6 bg-black-100 p-4 rounded-xl border border-white/5'>
              <div className='flex flex-col items-center justify-center p-2 bg-tertiary/40 rounded-lg'>
                <span className='text-secondary text-[11px] font-bold uppercase tracking-wider'>Epochs</span>
                <span className='text-white text-[20px] font-black mt-1'>{epochs}</span>
              </div>
              <div className='flex flex-col items-center justify-center p-2 bg-tertiary/40 rounded-lg'>
                <span className='text-secondary text-[11px] font-bold uppercase tracking-wider'>Accuracy</span>
                <span className='text-emerald-400 text-[20px] font-black mt-1'>{accuracy}%</span>
              </div>
              <div className='flex flex-col items-center justify-center p-2 bg-tertiary/40 rounded-lg'>
                <span className='text-secondary text-[11px] font-bold uppercase tracking-wider'>Model Loss</span>
                <span className='text-violet-accent text-[20px] font-black mt-1'>{loss.toFixed(3)}</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className='flex flex-wrap gap-4 text-sm text-secondary bg-black-100/50 px-4 py-3 rounded-lg border border-white/5 mb-6 justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-violet-accent rounded-full shadow-[0_0_8px_#915eff]' />
                <span>Model Input Head</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-[#00cea8] rounded-full shadow-[0_0_8px_#00cea8]' />
                <span>Hidden Nodes</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-[#ff4d4d] rounded-full shadow-[0_0_8px_#ff4d4d]' />
                <span>Overfitting Node</span>
              </div>
            </div>
          </div>

          <div>
            {!isPlaying && !gameOver && !gameWon && (
              <button
                onClick={startGame}
                className='w-full bg-gradient-to-r from-violet-accent to-indigo-600 hover:from-violet-accent hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-accent/20 border border-white/10 hover:scale-[1.01]'
              >
                Initialize Training Loop
              </button>
            )}

            {isPlaying && (
              <div className='text-center text-sm font-semibold text-secondary py-3 animate-pulse bg-violet-accent/10 rounded-xl border border-violet-accent/20 text-violet-accent'>
                ⚡ Backpropagation Phase: Model training active...
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Side: Canvas Gameboard */}
        <motion.div
          variants={fadeIn("left", "spring", 0.1, 1)}
          className='flex-[1.2] flex flex-col items-center justify-center relative bg-black-200 border border-white/5 rounded-2xl overflow-hidden shadow-2xl p-4 min-h-[420px]'
        >
          {/* Canvas Element */}
          <div className='relative w-full max-w-[600px] aspect-[3/2] bg-[#0c0a24] rounded-xl overflow-hidden border border-white/10'>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className='w-full h-full block'
            />

            {/* Game Screen Overlays */}
            <AnimatePresence>
              {/* Init Screen */}
              {!isPlaying && !gameOver && !gameWon && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 bg-[#0c0a24]/90 flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm'
                >
                  <div className='w-20 h-20 rounded-full bg-violet-accent/10 border border-violet-accent/30 flex items-center justify-center text-4xl mb-4 text-violet-accent animate-pulse'>
                    🧠
                  </div>
                  <h4 className='text-white font-extrabold text-[22px] mb-2'>Model Compiler Ready</h4>
                  <p className='text-secondary text-sm max-w-[320px] mb-5 leading-relaxed'>
                    Run the model optimization sequence to tune your neural weights and achieve 100% accuracy.
                  </p>
                  <button
                    onClick={startGame}
                    className='bg-violet-accent hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all cursor-pointer border border-white/10 shadow-lg'
                  >
                    Start Game
                  </button>
                </motion.div>
              )}

              {/* Game Over Screen (Loss) */}
              {gameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 bg-[#1d0e14]/95 flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm border border-red-500/20'
                >
                  <div className='w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-4 text-red-500 animate-bounce'>
                    ⚠️
                  </div>
                  <h4 className='text-red-500 font-extrabold text-[24px] mb-1'>Overfitting Detected!</h4>
                  <p className='text-secondary text-[13px] font-bold uppercase tracking-wider mb-2 text-red-400'>
                    Validation Loss Spiked
                  </p>
                  <p className='text-secondary text-sm max-w-[340px] mb-5 leading-relaxed'>
                    The network structure collided or strayed into noise. Accuracy halted at <strong className='text-white'>{accuracy}%</strong>.
                  </p>

                  {/* Tiny simulated chart */}
                  <div className='w-40 h-16 flex items-end gap-1 mb-5 border-b border-l border-white/10 px-2'>
                    <div className='bg-red-500/30 w-full h-[20%]' />
                    <div className='bg-red-500/40 w-full h-[35%]' />
                    <div className='bg-red-500/50 w-full h-[50%]' />
                    <div className='bg-red-500/70 w-full h-[65%]' />
                    <div className='bg-red-500 w-full h-[95%] animate-pulse' />
                  </div>

                  <button
                    onClick={startGame}
                    className='bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all cursor-pointer border border-white/10 shadow-lg'
                  >
                    Retrain Model
                  </button>
                </motion.div>
              )}

              {/* Game Win Screen (Victory) */}
              {gameWon && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='absolute inset-0 bg-[#071d18]/95 flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm border border-emerald-500/20'
                >
                  <div className='w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mb-4 text-emerald-400 animate-pulse'>
                    🏆
                  </div>
                  <h4 className='text-emerald-400 font-extrabold text-[24px] mb-1'>Optimal Model Converged!</h4>
                  <p className='text-emerald-300 text-[13px] font-bold uppercase tracking-wider mb-3'>
                    Accuracy = 100% | Loss &lt; 0.05
                  </p>
                  <p className='text-secondary text-sm max-w-[340px] mb-6 leading-relaxed'>
                    Congratulations! The model is fully optimized and ready to deploy to staging. Weights are perfectly saved.
                  </p>

                  <button
                    onClick={startGame}
                    className='bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all cursor-pointer border border-white/10 shadow-lg'
                  >
                    Train New Architecture
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Directional Controls - Hidden on desktop */}
          {isPlaying && (
            <div className='flex flex-col items-center gap-1.5 mt-4 sm:hidden w-full max-w-[200px]'>
              <button
                onClick={() => handleMobilePress("up")}
                className='w-12 h-12 bg-tertiary border border-white/10 hover:bg-white/10 active:scale-95 text-white font-extrabold text-xl rounded-xl flex items-center justify-center cursor-pointer shadow-md select-none'
              >
                ▲
              </button>
              <div className='flex gap-6 w-full justify-between'>
                <button
                  onClick={() => handleMobilePress("left")}
                  className='w-12 h-12 bg-tertiary border border-white/10 hover:bg-white/10 active:scale-95 text-white font-extrabold text-xl rounded-xl flex items-center justify-center cursor-pointer shadow-md select-none'
                >
                  ◀
                </button>
                <button
                  onClick={() => handleMobilePress("right")}
                  className='w-12 h-12 bg-tertiary border border-white/10 hover:bg-white/10 active:scale-95 text-white font-extrabold text-xl rounded-xl flex items-center justify-center cursor-pointer shadow-md select-none'
                >
                  ▶
                </button>
              </div>
              <button
                onClick={() => handleMobilePress("down")}
                className='w-12 h-12 bg-tertiary border border-white/10 hover:bg-white/10 active:scale-95 text-white font-extrabold text-xl rounded-xl flex items-center justify-center cursor-pointer shadow-md select-none'
              >
                ▼
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Game, "playground");
