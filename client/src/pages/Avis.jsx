import { useState } from "react";
import { Star, ExternalLink, ChevronDown, Zap } from "lucide-react";
import usePageMeta from "../components/seo/usePageMeta";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";
import useGoogleReviews from "../hooks/useGoogleReviews";

const INITIAL_COUNT = 6;
const BATCH_SIZE = 6;

function StarRating({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function ReviewCard({ r, isLive = false }) {
  return (
    <div className={`rounded-2xl border p-6 hover:shadow-lg transition-all ${
      isLive ? "bg-white border-kinetic/40 shadow-sm" : "bg-white border-slate-100"
    }`}>
      {isLive && (
        <div className="inline-flex items-center gap-1.5 bg-kinetic/10 text-kinetic text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-3">
          <Zap className="w-3 h-3" />
          En direct de Google
        </div>
      )}
      <StarRating n={r.rating} />
      <p className="mt-4 text-slate-700 text-sm leading-relaxed italic">"{r.text}"</p>
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="font-bold text-abyss text-sm">{r.name || r.author}</div>
          <div className="text-xs text-slate-400">{r.city || "Port-de-Bouc"} · {r.date}</div>
        </div>
        <div className="text-xs font-bold text-kinetic bg-kinetic/10 px-2 py-1 rounded">✓ Google</div>
      </div>
    </div>
  );
}

export default function Avis() {
  usePageMeta({
    title: "Avis clients — Plombier Diego Rodriguez, Port-de-Bouc",
    description: "Les avis des clients de Diego Rodriguez, plombier à Port-de-Bouc : ponctualité, travail soigné, devis clair. Découvrez leurs retours et confiez-nous votre projet.",
    canonical: "https://plomberie-diego-rodriguez.fr/avis",
  });

  const live = useGoogleReviews({
    rating: BUSINESS.rating,
    reviewCount: BUSINESS.reviewCount,
  });

  // Affichées en LIVE en haut (depuis Google API, max 5)
  const liveReviews = (live.reviews || []).slice(0, 5);

  // Normalise un nom pour dédoublonner (minuscules, sans accents, sans espaces en double)
  const normalize = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
  const liveAuthorKeys = new Set(liveReviews.map((r) => normalize(r.author)));

  // Dédoublonne le pool manuel : masque les avis déjà présents dans la section LIVE
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const dedupedPool = BUSINESS.reviews.filter((r) => !liveAuthorKeys.has(normalize(r.name)));
  const totalPool = dedupedPool.length;
  const visibleReviews = dedupedPool.slice(0, visibleCount);
  const hasMore = visibleCount < totalPool;

  return (
    <>
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Témoignages</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Avis clients</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarRating />
            <span className="text-white font-bold text-xl">
              {(live.rating ?? BUSINESS.rating).toString().replace(".", ",")}/5
            </span>
          </div>
          <p className="text-slate-300">
            +{live.totalReviews ?? BUSINESS.reviewCount} avis vérifiés sur Google · Port-de-Bouc et région
          </p>
          {live.isLive && (
            <p className="text-slate-500 text-xs mt-2 inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-kinetic" />
              Données synchronisées en temps réel avec Google
            </p>
          )}
        </div>
      </section>

      <section className="py-20 bg-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Avis LIVE Google (max 5, bordure kinetic) */}
          {liveReviews.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-kinetic" />
                <h2 className="text-xl font-black text-abyss">Les avis les plus récents</h2>
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">Live Google</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveReviews.map((r, i) => (
                  <ReviewCard key={`live-${i}`} r={r} isLive />
                ))}
              </div>
            </div>
          )}

          {/* Section Pool manuel — les témoignages marquants */}
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-black text-abyss">Témoignages marquants</h2>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">{totalPool} avis sélectionnés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {visibleReviews.map((r, i) => (
              <ReviewCard key={`${r.name}-${r.date}-${i}`} r={r} />
            ))}
          </div>

          {/* Afficher plus */}
          {hasMore && (
            <div className="text-center mb-12">
              <button
                onClick={() => setVisibleCount((v) => Math.min(v + BATCH_SIZE, totalPool))}
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-abyss text-abyss px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
              >
                Afficher plus de témoignages
                <ChevronDown className="w-4 h-4" />
                <span className="text-xs font-medium text-slate-500">
                  ({visibleCount}/{totalPool})
                </span>
              </button>
              <p className="text-xs text-slate-400 mt-3">
                Voir les {live.totalReviews ?? BUSINESS.reviewCount}+ avis complets sur{" "}
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-kinetic font-semibold hover:underline"
                >
                  la fiche Google
                </a>
              </p>
            </div>
          )}

          {!hasMore && totalPool > INITIAL_COUNT && (
            <p className="text-center text-sm text-slate-500 mb-12">
              Vous avez vu tous nos témoignages sélectionnés —{" "}
              <a
                href={BUSINESS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-kinetic font-semibold hover:underline"
              >
                voir les {live.totalReviews ?? BUSINESS.reviewCount}+ avis Google
              </a>
            </p>
          )}

          {/* Call to Google */}
          <div className="bg-abyss rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Vous avez fait appel à Diego ?</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">
              Votre avis compte énormément pour nous et pour nos futurs clients. Prenez 1 minute pour laisser votre témoignage sur Google !
            </p>
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-kinetic text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-800 transition-colors pulse-glow"
            >
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              Laisser un avis Google
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
