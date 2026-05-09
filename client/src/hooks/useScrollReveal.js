import { useEffect, useRef, useState } from "react";

/**
 * Hook : observe un élément et bascule isVisible à true quand il entre dans le viewport.
 * Utilisé pour les animations de reveal au scroll (fade-in, slide-in, etc.).
 *
 * Usage :
 *   const { ref, isVisible } = useScrollReveal();
 *   <div ref={ref} className={isVisible ? "opacity-100" : "opacity-0"}>...</div>
 */
export default function useScrollReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Si IntersectionObserver pas dispo (vieux nav), on affiche tout direct
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}
