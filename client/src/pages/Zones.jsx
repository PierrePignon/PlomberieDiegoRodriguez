import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, ChevronRight } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";

export default function Zones() {
  const primary = BUSINESS.zones.filter((z) => z.primary);
  const secondary = BUSINESS.zones.filter((z) => !z.primary);

  return (
    <>
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Où j'interviens</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">
            Plombier dans les Bouches-du-Rhône
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Diego Rodriguez intervient à Port-de-Bouc (13110) et dans toutes les communes du pourtour de l'étang de Berre, du littoral marseillais jusqu'à Istres et Martigues.
          </p>
        </div>
      </section>

      {/* Map + list */}
      <section className="py-20 bg-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-black text-abyss mb-6">Zones d'intervention prioritaires</h2>
              <div className="space-y-4">
                {primary.map((z) => (
                  <div key={z.name} className="bg-white rounded-xl border border-slate-100 p-5 hover:border-kinetic hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-kinetic/10 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-kinetic" />
                        </div>
                        <div>
                          <div className="font-bold text-abyss">{z.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">{z.delay}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={`tel:${BUSINESS.phone}`}
                        className="bg-kinetic text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Appeler
                      </a>
                    </div>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed">{z.desc}</p>
                  </div>
                ))}
              </div>

              {secondary.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-abyss mb-4">Zones secondaires (sur rendez-vous)</h3>
                  <div className="flex flex-wrap gap-3">
                    {secondary.map((z) => (
                      <div key={z.name} className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600">
                        {z.name} — {z.delay}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl mb-6 h-96">
                <iframe
                  title="Zone d'intervention Plomberie Rodriguez Diego"
                  src={BUSINESS.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-abyss rounded-2xl p-6 text-center">
                <div className="text-white font-bold text-lg mb-2">Besoin d'un plombier ?</div>
                <p className="text-slate-400 text-sm mb-4">Devis gratuit, intervention rapide dans toute la zone</p>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="flex items-center justify-center gap-2 bg-kinetic text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors w-full pulse-glow"
                >
                  <Phone className="w-5 h-5" />
                  {BUSINESS.phoneDisplay}
                </a>
                <Link to="/contact" className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-3 hover:text-white transition-colors">
                  Ou demandez un devis <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
