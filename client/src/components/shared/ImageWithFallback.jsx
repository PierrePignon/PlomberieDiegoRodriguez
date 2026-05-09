import { useState } from "react";
import { Wrench, Droplets, Bath, ShowerHead, Hammer, Flame, Search, Camera } from "lucide-react";

/**
 * Image avec fallback gracieux en cas d'erreur de chargement.
 * Si l'URL fail, affiche un SVG inline avec gradient + icône métier.
 *
 * Props :
 *   src     : URL principale de l'image
 *   alt     : alt text
 *   className : classes Tailwind (par défaut : "w-full h-full object-cover")
 *   icon    : composant Lucide pour le fallback (par défaut : Wrench)
 *   gradient: combinaison Tailwind pour le fallback (par défaut : "from-slate-600 to-slate-900")
 */
export default function ImageWithFallback({
  src,
  alt = "",
  className = "w-full h-full object-cover",
  icon = Wrench,
  gradient = "from-slate-600 to-slate-900",
  loading = "lazy",
  draggable,
}) {
  const [failed, setFailed] = useState(false);
  const Icon = icon;

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="text-white/50 transform scale-150">
          <Icon className="w-16 h-16" strokeWidth={1.2} />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      draggable={draggable}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

// Helper pour mapper les services aux icônes/couleurs de fallback
export const FALLBACK_ICONS = {
  depannage: { icon: Wrench, gradient: "from-orange-700 to-slate-900" },
  renovation: { icon: Bath, gradient: "from-amber-700 to-slate-900" },
  sanitaire: { icon: ShowerHead, gradient: "from-cyan-700 to-slate-900" },
  entretien: { icon: Wrench, gradient: "from-emerald-700 to-slate-900" },
  fuite: { icon: Droplets, gradient: "from-blue-700 to-slate-900" },
  debouchage: { icon: Droplets, gradient: "from-indigo-700 to-slate-900" },
  "chauffe-eau": { icon: Flame, gradient: "from-red-700 to-slate-900" },
  carrelage: { icon: Hammer, gradient: "from-stone-700 to-slate-900" },
  before: { icon: Search, gradient: "from-slate-500 to-slate-800" },
  after: { icon: Bath, gradient: "from-orange-600 to-amber-900" },
  example: { icon: Camera, gradient: "from-slate-400 to-slate-700" },
};
