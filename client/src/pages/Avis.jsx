import { Star, ExternalLink, Quote } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";

function StarRating({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function Avis() {
  return (
    <>
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Témoignages</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Avis clients</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <StarRating />
            <span className="text-white font-bold text-xl">5/5</span>
          </div>
          <p className="text-slate-300">+50 avis vérifiés sur Google · Port-de-Bouc et région</p>
        </div>
      </section>

      <section className="py-20 bg-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {BUSINESS.reviews.map((r) => (
              <div
                key={r.name + r.date}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
              >
                <StarRating n={r.rating} />
                <p className="mt-4 text-slate-700 text-sm leading-relaxed italic">"{r.text}"</p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-abyss text-sm">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.city} · {r.date}</div>
                  </div>
                  <div className="text-xs font-bold text-kinetic bg-kinetic/10 px-2 py-1 rounded">✓ Google</div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Google */}
          <div className="bg-abyss rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Vous avez fait appel à Diego ?</h2>
            <p className="text-slate-400 mb-6 max-w-xl mx-auto">Votre avis compte énormément pour nous et pour nos futurs clients. Prenez 1 minute pour laisser votre témoignage sur Google !</p>
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-kinetic text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors pulse-glow"
            >
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
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
