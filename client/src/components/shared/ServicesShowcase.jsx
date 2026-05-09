import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { BUSINESS } from "../../lib/business";
import ImageWithFallback, { FALLBACK_ICONS } from "./ImageWithFallback";

/**
 * Section "Nos expertises" en scroll horizontal style Amazon / Apple TV.
 * - Mobile : scroll tactile avec snap CSS
 * - Desktop : flèches de navigation + drag souris
 * - Cards avec image de fond, overlay sombre, titre + description
 */

// Images locales par service. Servies depuis /public/images/realisations/.
// Si un chemin n'existe pas, ImageWithFallback affiche automatiquement
// un gradient élégant + une icône métier en fallback.
const SERVICE_IMAGES = {
  depannage: "/images/realisations/service-depannage.jpg",
  renovation: "/images/realisations/sdb-chantier-apres.png",
  sanitaire: "/images/realisations/service-sanitaire.png",
  entretien: "/images/realisations/service-entretien.jpg",
  fuite: "/images/realisations/service-recherche-fuite.jpg",
  debouchage: "/images/realisations/service-debouchage.png",
  "chauffe-eau": "/images/realisations/service-chauffe-eau.png",
  carrelage: "/images/realisations/sdb-renovation-apres.png",
};

export default function ServicesShowcase() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mise à jour de l'état des flèches selon la position du scroll
  const updateScrollState = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const step = containerRef.current.clientWidth * 0.6;
    containerRef.current.scrollBy({
      left: direction === "right" ? step : -step,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Cache la scrollbar du carrousel */}
      <style>{`
        .services-scroll::-webkit-scrollbar { display: none; }
        .services-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* En-tête */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">
              Nos expertises
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-abyss mb-4 leading-tight">
              Plomberie & Carrelage<br className="hidden sm:block" />
              <span className="text-kinetic">à Port-de-Bouc</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl">
              Un seul artisan pour tous vos travaux. Faites défiler pour découvrir nos spécialités.
            </p>
          </div>

          {/* Flèches desktop */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Précédent"
              className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-abyss hover:bg-abyss hover:text-white text-abyss flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-abyss disabled:hover:border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Suivant"
              className="w-12 h-12 rounded-full border-2 border-slate-200 hover:border-abyss hover:bg-abyss hover:text-white text-abyss flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-abyss disabled:hover:border-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carrousel horizontal */}
      <div
        ref={containerRef}
        className="services-scroll flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pl-4 sm:pl-6 lg:pl-8 pb-6"
        style={{ WebkitOverflowScrolling: "touch", scrollPaddingLeft: "1rem" }}
      >
        {BUSINESS.services.map((service) => {
          const img = SERVICE_IMAGES[service.id];
          return (
            <Link
              key={service.id}
              to={`/services#${service.id}`}
              className="snap-start shrink-0 w-[82vw] sm:w-[55vw] md:w-[42%] lg:w-[31%] xl:w-[26%] aspect-[3/4] relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image de fond avec fallback automatique élégant si URL casse */}
              <ImageWithFallback
                src={img}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                icon={(FALLBACK_ICONS[service.id] || {}).icon}
                gradient={(FALLBACK_ICONS[service.id] || {}).gradient || "from-slate-700 to-abyss"}
              />

              {/* Overlay sombre élégant pour lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500" />

              {/* Contenu */}
              <div className="absolute inset-0 p-6 md:p-7 flex flex-col justify-end">
                <div className="text-3xl mb-3 drop-shadow-lg">{service.emoji}</div>
                <h3 className="text-white text-xl md:text-2xl font-black mb-2 leading-tight drop-shadow-lg">
                  {service.title}
                </h3>
                <p className="text-white/85 text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.short}
                </p>
                <div className="inline-flex items-center gap-1.5 text-kinetic font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  Découvrir
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bordure subtile au hover */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/20 transition-all duration-500 pointer-events-none" />
            </Link>
          );
        })}

        {/* Spacer en fin pour bien voir la dernière carte */}
        <div className="shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden="true" />
      </div>

      {/* Indicateur de scroll mobile */}
      <div className="md:hidden text-center text-slate-400 text-xs mt-4 px-4 flex items-center justify-center gap-2">
        <div className="h-px w-8 bg-slate-200" />
        Faites défiler horizontalement
        <div className="h-px w-8 bg-slate-200" />
      </div>

      {/* CTA "Voir tous nos services" */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 bg-abyss text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Voir tous nos services
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
