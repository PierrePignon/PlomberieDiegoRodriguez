import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "../lib/business";
import FeaturedRealization from "../components/realisations/FeaturedRealization";
import RealizationsFeed from "../components/realisations/RealizationsFeed";
import CTASection from "../components/shared/CTASection";

export default function Realisations() {
  // Réalisations PHARES = celles qui ont un avant/après
  const featured = BUSINESS.realizations.filter(
    (r) => r.imageBefore && r.imageAfter
  );

  // Feed = les autres
  const feed = BUSINESS.realizations.filter(
    (r) => !(r.imageBefore && r.imageAfter)
  );

  return (
    <>
      {/* HERO */}
      <section className="relative py-24 md:py-32 bg-abyss overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-kinetic/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-kinetic/10 border border-kinetic/30 text-kinetic px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Nos réalisations
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Voyez chaque chantier
            <span className="block text-kinetic">comme si vous y étiez</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Avant. Après. Le même artisan, du diagnostic à la finition. Faites glisser, comparez,
            et imaginez ce qu'on peut faire chez vous.
          </p>
        </div>
      </section>

      {/* RÉALISATIONS PHARES — sticky scroll storytelling premium */}
      {featured.length > 0 && (
        <div className="bg-white">
          {featured.map((r, i) => (
            <FeaturedRealization
              key={r.title + i}
              realization={r}
              index={i + 1}
              total={featured.length}
            />
          ))}
        </div>
      )}

      {/* FEED — chantiers récents (image unique) */}
      <RealizationsFeed items={feed} />

      {/* CTA personnalisé bas de page */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-abyss mb-4">
            Votre projet est le suivant ?
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            Photographiez ce que vous voulez transformer, envoyez-le nous, on revient vers vous avec un
            devis gratuit dans les 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl"
            >
              Demander un devis gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-abyss hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              <Phone className="w-5 h-5" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
