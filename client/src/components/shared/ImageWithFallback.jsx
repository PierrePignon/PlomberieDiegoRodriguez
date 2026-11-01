import { useState } from "react";
import { Wrench, Droplets, Bath, ShowerHead, Hammer, Flame, Search, Camera } from "lucide-react";

/**
 * Image avec fallback gracieux + support WebP responsive automatique.
 *
 * Comportement :
 *  - Si `src` pointe sur un PNG/JPG dans /images/ et que des variantes WebP
 *    `-400w.webp`, `-800w.webp`, `-1200w.webp` existent (générées par scripts/optimize-images.js),
 *    on utilise <picture><source srcset=... type="image/webp"></picture>
 *    pour que le navigateur serve la bonne taille selon le device + préfère WebP.
 *  - Si le WebP n'est pas trouvé par le navigateur, il tombe sur l'<img> original (PNG/JPG).
 *  - Si l'<img> fail aussi (URL cassée), on affiche un fallback gradient + icône métier.
 *
 * Props :
 *   src       : URL principale (PNG/JPG → srcset WebP auto, .webp direct → pas de srcset)
 *   alt       : alt text
 *   className : classes Tailwind (par défaut : "w-full h-full object-cover")
 *   icon      : composant Lucide pour le fallback
 *   gradient  : gradient Tailwind pour le fallback
 *   loading   : "lazy" (défaut) ou "eager" pour above-the-fold
 *   priority  : true → eager + fetchpriority="high" (Hero, LCP)
 *   sizes     : attribut sizes pour srcset (par défaut adapté aux grilles classiques)
 *   draggable : passé à <img>
 */
export default function ImageWithFallback({
  src,
  alt = "",
  className = "w-full h-full object-cover",
  icon = Wrench,
  gradient = "from-slate-600 to-slate-900",
  loading = "lazy",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
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

  // Détection : si src est un PNG/JPG, on tente les variantes WebP
  const webpSrcSet = buildWebpSrcSet(src);
  const effectiveLoading = priority ? "eager" : loading;
  const effectiveFetchPriority = priority ? "high" : undefined;

  // Image déjà en .webp ou .svg → rendu direct sans <picture>
  if (!webpSrcSet) {
    return (
      <img
        src={src}
        alt={alt}
        loading={effectiveLoading}
        fetchpriority={effectiveFetchPriority}
        draggable={draggable}
        className={className}
        sizes={sizes}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        loading={effectiveLoading}
        fetchpriority={effectiveFetchPriority}
        draggable={draggable}
        className={className}
        sizes={sizes}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

/**
 * À partir d'un chemin "/images/foo/bar.png", retourne le srcset WebP :
 *   "/images/foo/bar-400w.webp 400w, /images/foo/bar-800w.webp 800w, /images/foo/bar-1200w.webp 1200w"
 * Retourne null si le format source n'est pas PNG/JPG (ou si c'est une URL externe).
 */
function buildWebpSrcSet(src) {
  if (!src || typeof src !== "string") return null;
  // URL externe (http://, https://, data:...) → on ne touche pas
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return null;

  const match = src.match(/^(.*?)\.(png|jpg|jpeg)$/i);
  if (!match) return null;
  const base = match[1]; // "/images/foo/bar"

  const widths = [400, 800, 1200];
  return widths.map((w) => `${base}-${w}w.webp ${w}w`).join(", ");
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
