import { memo, useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useInView } from "../../hooks/useInView";

const Stars = (props) => {
  const ref = useRef();
  const sphere = useMemo(
    () => random.inSphere(new Float32Array(3500 * 3), { radius: 1.2 }),
    []
  );

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const [containerRef, isInView] = useInView({ rootMargin: "250px 0px" });

  return (
    <div ref={containerRef} className='w-full h-auto absolute inset-0 z-[-1]'>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        frameloop={isInView ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "low-power", antialias: false, alpha: true }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default memo(StarsCanvas);
