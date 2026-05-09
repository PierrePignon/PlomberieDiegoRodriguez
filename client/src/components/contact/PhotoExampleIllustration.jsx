/**
 * Illustration schématique SVG d'une salle de bain stylisée,
 * avec un cadre coloré qui indique ce que l'utilisateur doit cadrer
 * pour le niveau de zoom demandé.
 *
 * Trois niveaux : "large", "medium", "close"
 *
 * Avantages vs photo réelle :
 * - 100% indépendant (pas d'URL qui casse)
 * - Cohérent visuellement entre les 3 étapes
 * - Pédagogique : on voit OÙ le cadre photo doit se placer
 *
 * Props :
 *   level : "large" | "medium" | "close"
 *   accent: classe Tailwind couleur du cadre indicatif (ex: "stroke-orange-500")
 */
export default function PhotoExampleIllustration({ level = "large", accent = "stroke-orange-500" }) {
  // Position et taille du cadre indicatif selon le niveau de zoom
  const FRAME = {
    large: { x: 20, y: 20, w: 360, h: 200, label: "Toute la pièce" },
    medium: { x: 220, y: 90, w: 140, h: 110, label: "La zone du problème" },
    close: { x: 268, y: 152, w: 50, h: 38, label: "Le détail exact" },
  }[level];

  // Couleurs / classes pour le label
  const labelColors = {
    "stroke-orange-500": { bg: "fill-orange-500", text: "text-orange-50" },
    "stroke-blue-500": { bg: "fill-blue-500", text: "text-blue-50" },
    "stroke-green-500": { bg: "fill-green-500", text: "text-green-50" },
  }[accent] || { bg: "fill-orange-500", text: "text-orange-50" };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 400 240"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {/* Fond (mur clair) */}
        <defs>
          <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <pattern id="tileMid" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="#e2e8f0" />
            <line x1="0" y1="0" x2="20" y2="0" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Mur du fond (carrelé) */}
        <rect x="0" y="0" width="400" height="190" fill="url(#tileMid)" />

        {/* Sol (perspective simple) */}
        <polygon points="0,190 400,190 400,240 0,240" fill="url(#floorGradient)" />

        {/* === MOBILIER STYLISÉ === */}

        {/* Miroir au-dessus du lavabo */}
        <rect x="246" y="40" width="64" height="48" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
        <rect x="252" y="46" width="20" height="20" fill="#cbd5e1" opacity="0.5" />

        {/* Plan vasque */}
        <rect x="230" y="115" width="100" height="8" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />

        {/* Vasque (cuvette stylisée) */}
        <ellipse cx="280" cy="125" rx="22" ry="5" fill="#cbd5e1" />
        <path d="M 258 123 Q 280 145 302 123" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />

        {/* Robinet */}
        <rect x="277" y="105" width="6" height="12" fill="#94a3b8" rx="1" />
        <rect x="275" y="103" width="10" height="3" fill="#64748b" rx="1" />

        {/* Tuyau / siphon en dessous (zone à fuite potentielle) */}
        <rect x="276" y="140" width="8" height="14" fill="#94a3b8" rx="2" />
        <ellipse cx="280" cy="158" rx="12" ry="3" fill="#64748b" opacity="0.6" />

        {/* Petite tâche d'eau au sol pour suggérer une fuite */}
        <ellipse cx="290" cy="200" rx="14" ry="4" fill="#3b82f6" opacity="0.25" />
        <ellipse cx="290" cy="200" rx="8" ry="2.5" fill="#2563eb" opacity="0.35" />

        {/* Meuble salle de bain à gauche pour donner du contexte */}
        <rect x="40" y="130" width="100" height="60" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" rx="2" />
        <line x1="90" y1="130" x2="90" y2="190" stroke="#94a3b8" strokeWidth="0.8" />
        <circle cx="65" cy="160" r="2" fill="#64748b" />
        <circle cx="115" cy="160" r="2" fill="#64748b" />

        {/* Porte serviette stylisée */}
        <rect x="160" y="100" width="40" height="3" fill="#94a3b8" rx="1.5" />
        <rect x="160" y="100" width="3" height="40" fill="#94a3b8" rx="1.5" />
        <rect x="197" y="100" width="3" height="40" fill="#94a3b8" rx="1.5" />

        {/* === CADRE INDICATIF === */}
        {/* Cadre semi-transparent qui assombrit autour */}
        <mask id="frameMask">
          <rect width="400" height="240" fill="white" />
          <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} fill="black" rx="6" />
        </mask>
        <rect width="400" height="240" fill="black" opacity="0.35" mask="url(#frameMask)" />

        {/* Bordure animée du cadre photo */}
        <rect
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
          fill="none"
          className={accent}
          strokeWidth="3"
          strokeDasharray="8 4"
          rx="6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-24"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Coins du cadre (style appareil photo) */}
        {[
          [FRAME.x, FRAME.y, "tl"],
          [FRAME.x + FRAME.w, FRAME.y, "tr"],
          [FRAME.x, FRAME.y + FRAME.h, "bl"],
          [FRAME.x + FRAME.w, FRAME.y + FRAME.h, "br"],
        ].map(([cx, cy, k]) => (
          <g key={k}>
            <circle cx={cx} cy={cy} r="4" className={accent} fill="white" strokeWidth="2" />
          </g>
        ))}
      </svg>

      {/* Étiquette en bas indiquant ce qu'il faut cadrer */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm shadow-lg px-3 py-1.5 rounded-full text-xs font-bold text-abyss border border-slate-200 whitespace-nowrap">
        🎯 Cadrez : {FRAME.label}
      </div>
    </div>
  );
}
