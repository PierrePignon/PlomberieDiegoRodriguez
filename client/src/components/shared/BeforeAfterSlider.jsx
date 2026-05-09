import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Search, Bath } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";

/**
 * Slider avant/après interactif (drag horizontal).
 * - Drag souris ET tactile
 * - Animation d'intro pour signaler l'interactivité
 * - Bouton optionnel pour passer en plein écran
 *
 * Props :
 *  - imageBefore : URL image avant
 *  - imageAfter  : URL image après
 *  - alt         : texte alternatif
 *  - onFullscreen: callback bouton "plein écran" (optionnel)
 *  - className   : classes Tailwind additionnelles (hauteur typiquement)
 *  - showLabels  : afficher les badges AVANT / APRÈS (défaut true)
 *  - showHint    : afficher l'indication "Glissez pour comparer" (défaut true)
 */
export default function BeforeAfterSlider({
  imageBefore,
  imageAfter,
  alt = "",
  onFullscreen = null,
  className = "h-96 md:h-[32rem]",
  showLabels = true,
  showHint = true,
}) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  // Animation d'intro : aller-retour pour signaler l'interactivité
  useEffect(() => {
    if (hasInteracted) return;

    let animationFrame;
    let frame = 0;
    const totalFrames = 90;

    const animate = () => {
      frame++;
      if (frame < totalFrames && !hasInteracted) {
        const eased = 50 + Math.sin((frame / totalFrames) * Math.PI * 2) * 25;
        setPosition(eased);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setPosition(50);
      }
    };

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [hasInteracted]);

  // Listeners globaux pendant le drag (souris)
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleMove]);

  const handleStart = (clientX) => {
    setIsDragging(true);
    setHasInteracted(true);
    handleMove(clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none cursor-ew-resize bg-slate-900 group ${className}`}
      onMouseDown={(e) => handleStart(e.clientX)}
      onTouchStart={(e) => {
        if (e.touches[0]) handleStart(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
      }}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* APRÈS — image de fond, toujours visible */}
      <ImageWithFallback
        src={imageAfter}
        alt={`${alt} - après`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
        icon={Bath}
        gradient="from-orange-600 via-amber-700 to-slate-900"
      />

      {/* AVANT — image au-dessus, masquée par clip-path */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`,
        }}
      >
        <ImageWithFallback
          src={imageBefore}
          alt={`${alt} - avant`}
          className="w-full h-full object-cover"
          draggable={false}
          icon={Search}
          gradient="from-slate-500 via-slate-700 to-slate-900"
        />
      </div>

      {/* Labels AVANT / APRÈS */}
      {showLabels && (
        <>
          <div
            className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-opacity"
            style={{ opacity: position > 10 ? 1 : 0 }}
          >
            Avant
          </div>
          <div
            className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md transition-opacity"
            style={{ opacity: position < 90 ? 1 : 0 }}
          >
            Après
          </div>
        </>
      )}

      {/* Bouton plein écran (optionnel) */}
      {onFullscreen && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFullscreen();
          }}
          className="absolute bottom-4 right-4 w-11 h-11 bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white rounded-lg flex items-center justify-center transition-all opacity-70 hover:opacity-100"
          aria-label="Voir en plein écran"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      )}

      {/* Ligne de séparation + handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
        style={{ left: `calc(${position}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-2xl flex items-center justify-center ring-4 ring-white/30">
          <ChevronLeft className="w-4 h-4 text-slate-900" strokeWidth={3} />
          <ChevronRight className="w-4 h-4 text-slate-900" strokeWidth={3} />
        </div>
      </div>

      {/* Hint discret */}
      {showHint && !hasInteracted && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full pointer-events-none animate-pulse">
          Glissez pour comparer
        </div>
      )}
    </div>
  );
}
