import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight, Phone } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";

function ProjectCard({ r }) {
  const [showAfter, setShowAfter] = useState(true);
  const hasBeforeAfter = r.imageBefore && r.imageAfter;
  const displayImage = hasBeforeAfter ? (showAfter ? r.imageAfter : r.imageBefore) : r.image;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
      <div className="relative h-60 overflow-hidden">
        <img
          src={displayImage}
          alt={r.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-abyss text-white text-xs font-bold px-2.5 py-1 rounded-full">{r.type}</div>
        <div className="absolute top-3 right-3 bg-kinetic text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <MapPin className="w-3 h-3" />{r.city}
        </div>
        {hasBeforeAfter && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex bg-black/60 rounded-full overflow-hidden text-xs font-bold">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-3 py-1.5 transition-colors ${!showAfter ? 'bg-white text-abyss' : 'text-white'}`}
            >Avant</button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-3 py-1.5 transition-colors ${showAfter ? 'bg-kinetic text-white' : 'text-white'}`}
            >Après</button>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-abyss mb-4">{r.title}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="font-bold text-abyss w-20 shrink-0">Problème</span>
            <span className="text-slate-600">{r.problem}</span>
          </div>
          <div className="w-full h-px bg-slate-100" />
          <div className="flex gap-3">
            <span className="font-bold text-kinetic w-20 shrink-0">Solution</span>
            <span className="text-slate-600">{r.solution}</span>
          </div>
          <div className="w-full h-px bg-slate-100" />
          <div className="flex gap-3">
            <span className="font-bold text-green-600 w-20 shrink-0">Résultat</span>
            <span className="text-slate-600">{r.result}</span>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center gap-2 bg-kinetic text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Appeler
          </a>
          <Link
            to="/contact"
            className="flex items-center gap-2 bg-abyss text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            Devis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Realisations() {
  return (
    <>
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Portfolio</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Nos réalisations</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Découvrez les chantiers réalisés par Diego Rodriguez à Port-de-Bouc, Martigues, Fos-sur-Mer et dans toute la zone d'intervention.
          </p>
        </div>
      </section>

      <section className="py-20 bg-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BUSINESS.realizations.map((r) => (
              <ProjectCard key={r.title} r={r} />
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Un projet de rénovation ?" subtitle="Plomberie, salle de bain, carrelage — devis gratuit sous 24h" />
    </>
  );
}
