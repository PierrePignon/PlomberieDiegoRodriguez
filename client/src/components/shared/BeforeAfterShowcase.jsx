import { useState } from "react";
import { Sparkles, MapPin } from "lucide-react";
import { BUSINESS } from "../../lib/business";
import BeforeAfterSlider from "./BeforeAfterSlider";
import BeforeAfterModal from "./BeforeAfterModal";

/**
 * Section "showcase" pour la home — montre les transformations avant/après
 * de manière interactive et impactante.
 *
 * Pas de bouton "voir avant/après" : le slider est INTÉGRÉ directement,
 * l'utilisateur voit la transformation en temps réel.
 *
 * Clic sur le slider → modal plein écran avec navigation entre toutes
 * les réalisations qui ont un avant/après.
 */
export default function BeforeAfterShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Réalisations avec avant/après uniquement
  const showcaseItems = BUSINESS.realizations.filter(
    (r) => r.imageBefore && r.imageAfter
  );

  if (showcaseItems.length === 0) return null;

  const current = showcaseItems[activeIndex];

  return (
    <>
      <section className="relative py-20 bg-gradient-to-b from-slate-900 to-abyss overflow-hidden">
        {/* Décorations background */}
        <div className="absolute inset-0 blueprint-bg opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-5">
              <Sparkles className="w-4 h-4" />
              Avant / Après
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Voyez la transformation
              <span className="block text-orange-500">en temps réel</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Glissez la barre pour comparer. Chaque chantier est livré clé en main par Diego Rodriguez.
            </p>
          </div>

          {/* Slider principal */}
          <div className="relative max-w-5xl mx-auto">
            <BeforeAfterSlider
              key={current.title}
              imageBefore={current.imageBefore}
              imageAfter={current.imageAfter}
              alt={current.title}
              onFullscreen={() => setModalOpen(true)}
              className="h-[420px] md:h-[560px] w-full shadow-2xl ring-1 ring-white/10"
            />

            {/* Carte d'infos sous le slider */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 text-white/80 text-sm mb-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded">
                    {current.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    {current.city}
                  </span>
                </div>
                <h3 className="text-white text-xl font-black mb-1">{current.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {current.result || current.solution}
                </p>
              </div>

              {/* Sélecteur de réalisation (si plusieurs) */}
              {showcaseItems.length > 1 && (
                <div className="flex gap-2 shrink-0">
                  {showcaseItems.map((item, idx) => (
                    <button
                      key={item.title}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === activeIndex
                          ? "bg-orange-500 w-8"
                          : "bg-white/20 hover:bg-white/40"
                      }`}
                      aria-label={`Voir ${item.title}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mention plein écran */}
            <p className="mt-4 text-center text-slate-500 text-xs">
              Cliquez sur l'icône en bas à droite pour voir en plein écran
            </p>
          </div>
        </div>
      </section>

      {/* Modal plein écran */}
      {modalOpen && (
        <BeforeAfterModal
          realizations={BUSINESS.realizations}
          initialIndex={BUSINESS.realizations.indexOf(current)}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
