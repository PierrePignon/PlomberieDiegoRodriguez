import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

/**
 * Modal plein écran qui affiche une réalisation avant/après en grand.
 * Permet de naviguer entre les réalisations qui ont un avant/après.
 *
 * Props :
 *  - realizations : tableau complet (BUSINESS.realizations)
 *  - initialIndex : index de la réalisation à afficher au lancement
 *  - onClose      : callback de fermeture
 */
export default function BeforeAfterModal({ realizations, initialIndex = 0, onClose }) {
  // Filtrer uniquement les réalisations avec avant/après
  const items = realizations.filter((r) => r.imageBefore && r.imageAfter);

  // Trouver l'index dans le tableau filtré qui correspond à initialIndex global
  const findStartIndex = () => {
    const targetItem = realizations[initialIndex];
    if (!targetItem) return 0;
    const idx = items.findIndex((r) => r.title === targetItem.title);
    return idx >= 0 ? idx : 0;
  };

  const [index, setIndex] = useState(findStartIndex);

  // Gestion clavier
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
    };
    window.addEventListener("keydown", onKey);

    // Bloquer scroll body
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, items.length]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex-1">
          <div className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">
            Réalisation {index + 1} / {items.length}
          </div>
          <h3 className="text-white text-xl md:text-2xl font-black">{current.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Slider */}
      <div className="flex-1 flex items-center justify-center px-2 sm:px-6 py-4 min-h-0">
        <div className="w-full max-w-7xl h-full">
          <BeforeAfterSlider
            key={current.title}
            imageBefore={current.imageBefore}
            imageAfter={current.imageAfter}
            alt={current.title}
            className="h-full max-h-[75vh] w-full"
            showHint={false}
          />
        </div>
      </div>

      {/* Infos & navigation */}
      <div className="border-t border-white/10 px-6 py-4 bg-black/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          {/* Détails */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 text-white/80 text-sm mb-2">
              <span className="bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded">
                {current.type}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {current.city}
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
              {current.result || current.solution}
            </p>
          </div>

          {/* Nav buttons */}
          {items.length > 1 && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
                className="w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % items.length)}
                className="w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
