import { Link } from "react-router-dom";
import { Phone, CheckCircle, ChevronRight } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Nos prestations</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">
            Plombier & Carreleur à Port-de-Bouc
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Plomberie, recherche de fuite, débouchage, rénovation salle de bain, carrelage… Diego Rodriguez prend en charge tous vos travaux avec sérieux et réactivité.
          </p>
        </div>
      </section>

      {/* Services principaux */}
      <section className="py-20 bg-mist">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Nos expertises clés</div>
            <h2 className="text-3xl font-black text-abyss">4 spécialités, un seul artisan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {BUSINESS.services.filter(s => s.main).map((s) => (
              <div key={s.id} id={s.id} className="bg-white rounded-2xl border-2 border-kinetic shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-abyss to-slate-800 p-8 flex items-center gap-4">
                  <div className="text-4xl">{s.emoji}</div>
                  <div>
                    <div className="text-kinetic text-xs font-bold uppercase tracking-widest mb-1">Service principal</div>
                    <h2 className="text-white font-black text-xl">{s.title}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 leading-relaxed mb-5">{s.desc}</p>
                  <ul className="space-y-2 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-kinetic shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3">
                    <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 bg-kinetic text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition-colors text-sm">
                      <Phone className="w-4 h-4" />{BUSINESS.phoneDisplay}
                    </a>
                    <Link to="/contact" className="flex items-center gap-2 bg-abyss text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-colors text-sm">
                      Devis <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Autres services */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-black text-abyss">Autres prestations</h3>
          </div>
          <div className="space-y-6">
            {BUSINESS.services.filter(s => !s.main).map((s, i) => (
              <div key={s.id} id={s.id} className={`flex flex-col lg:flex-row gap-8 items-start bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}` }>
                <div className="lg:w-1/3 bg-gradient-to-br from-abyss to-slate-800 p-10 flex flex-col items-center justify-center text-center min-h-48 w-full">
                  <div className="text-5xl mb-4">{s.emoji}</div>
                  <h2 className="text-white font-black text-xl">{s.title}</h2>
                  <div className="mt-3 w-10 h-0.5 bg-kinetic" />
                </div>
                <div className="lg:w-2/3 p-8">
                  <p className="text-slate-600 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-kinetic shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 bg-kinetic text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors text-sm">
                      <Phone className="w-4 h-4" />{BUSINESS.phoneDisplay}
                    </a>
                    <Link to="/contact" className="flex items-center gap-2 bg-abyss text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors text-sm">
                      Devis gratuit <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
