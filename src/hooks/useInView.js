import { useEffect, useRef, useState } from "react";

export const useInView = ({
  root = null,
  rootMargin = "200px",
  threshold = 0.01,
  once = false,
} = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (!("IntersectionObserver" in window)) {
      const frameId = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);

        if (visible && once) {
          observer.unobserve(entry.target);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return [ref, isInView];
};
