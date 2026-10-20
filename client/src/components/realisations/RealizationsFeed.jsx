import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import useScrollReveal from "../../hooks/useScrollReveal";
import { slug, cityPageUrl, serviceFromRealisationType, serviceUrl } from "../../lib/utils";
import { BUSINESS } from "../../lib/business";

/**
 * Feed simple "D'autres chantiers récents".
 * - Grille de cartes avec image, titre, ville, type
 * - Pour les réalisations qui n'ont PAS d'avant/après (champ "image" simple)
 * - Facile à enrichir : ajouter une entrée dans business.realizations sans imageBefore/imageAfter
 */
export default function RealizationsFeed({ items }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-mist border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">
            Galerie complète
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-abyss mb-3">
            D'autres chantiers récents
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Aperçu d'autres interventions réalisées sur la zone Port-de-Bouc et environs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FeedCard key={item.title + i} item={item} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeedCard({ item, delay }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  // Image à afficher : priorité imageAfter > image
  const cover = item.imageAfter || item.image;

  return (
    <div
      ref={ref}
      id={slug(item.title)}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500 scroll-mt-24 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="relative h-56 overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-abyss" />
        )}
        <div className="absolute top-3 left-3 bg-abyss text-white text-xs font-bold px-2.5 py-1 rounded">
          {item.type}
        </div>
        <div className="absolute top-3 right-3 bg-kinetic text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.city}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-abyss mb-2 group-hover:text-kinetic transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {item.result || item.solution}
        </p>
        {/* Maillage interne : vers la ville + le service correspondant */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          {(() => {
            const cityUrl = cityPageUrl(item.city, BUSINESS.zones);
            const sId = serviceFromRealisationType(item.type);
            const links = [];
            if (cityUrl) links.push(<Link key="city" to={cityUrl} className="text-xs bg-slate-100 hover:bg-kinetic hover:text-white text-slate-600 px-2.5 py-1 rounded transition-colors">Plombier {item.city}</Link>);
            if (sId) links.push(<Link key="svc" to={serviceUrl(sId)} className="text-xs bg-slate-100 hover:bg-kinetic hover:text-white text-slate-600 px-2.5 py-1 rounded transition-colors">{item.type}</Link>);
            return links;
          })()}
        </div>
      </div>
    </div>
  );
}
