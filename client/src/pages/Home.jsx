import { Link } from "react-router-dom";
import { Phone, Star, MapPin, CheckCircle, ChevronRight, Wrench, Droplets, Shield, Clock, ThumbsUp, ExternalLink, MessageCircle } from "lucide-react";
import { useState } from "react";
import { BUSINESS } from "../lib/business";
import { slug } from "../lib/utils";
import CTASection from "../components/shared/CTASection";
import ServicesShowcase from "../components/shared/ServicesShowcase";

function StarRating({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-mist transition-colors"
      >
        <span className="font-semibold text-abyss pr-4">{q}</span>
        <ChevronRight className={`w-5 h-5 text-kinetic shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed bg-mist border-t border-slate-100">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const topReviews = BUSINESS.reviews.slice(0, 3);
  const topServices = BUSINESS.services.slice(0, 6);

  return (
    <>
      {/* SERVICES — scroll horizontal style Amazon : Diego veut que ce soit la première chose visible */}
      <ServicesShowcase />

      {/* BANDEAU PRÉSENTATION — compact, sobre, texte sombre, photo discrète en bg */}
      <section className="relative bg-mist border-y border-slate-200 overflow-hidden">
        {/* Photo discrète en background, voile blanc par-dessus pour rendre le texte lisible */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/realisations/service-depannage.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mist via-mist/90 to-mist/70" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Bloc texte (gauche) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 text-abyss px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
                <MapPin className="w-3.5 h-3.5 text-kinetic" />
                Port-de-Bouc & Bouches-du-Rhône
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-abyss mb-3 leading-tight">
                Plombier à Port-de-Bouc — <span className="text-kinetic">artisan local depuis 2018</span>
              </h1>

              <p className="text-slate-700 text-base md:text-lg max-w-2xl leading-relaxed mb-5">
                Plomberie, rénovation salle de bain & carrelage. <strong>Diego Rodriguez</strong>, artisan sérieux, intervient rapidement sur Port-de-Bouc, Martigues, Fos-sur-Mer, Istres et alentours.
              </p>

              {/* Trust badges — version discrète sur fond clair */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Devis gratuit", "Artisan certifié", "Garantie décennale", "Travail garanti"].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3 text-kinetic" />
                    {b}
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  {BUSINESS.phoneDisplay}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-abyss text-abyss px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Demander un devis
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/rendez-vous"
                  className="inline-flex items-center justify-center gap-2 text-abyss hover:text-kinetic px-3 py-3 font-semibold transition-colors text-sm"
                >
                  Prendre RDV en ligne →
                </Link>
              </div>
            </div>

            {/* Bloc note + rappel d'horaire (droite) */}
            <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-slate-300">
              <div className="space-y-4">
                {/* Note Google */}
                <div className="flex items-center gap-3">
                  <StarRating />
                  <div className="flex-1">
                    <div className="font-black text-abyss text-lg">4,9 / 5</div>
                    <div className="text-slate-500 text-xs">+50 avis vérifiés Google</div>
                  </div>
                  <a
                    href={BUSINESS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-kinetic text-xs font-bold hover:underline whitespace-nowrap"
                  >
                    Voir →
                  </a>
                </div>

                {/* Séparateur fin */}
                <div className="h-px bg-slate-200" />

                {/* Horaires */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-kinetic" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-abyss text-sm">Intervention rapide</div>
                    <div className="text-slate-500 text-xs">Lun-Ven · {BUSINESS.hoursShort}</div>
                  </div>
                </div>

                {/* Zone */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-kinetic" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-abyss text-sm">10 communes couvertes</div>
                    <div className="text-slate-500 text-xs">Port-de-Bouc, Martigues, Fos, Istres…</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONE D'INTERVENTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Zone d'intervention</div>
              <h2 className="text-3xl sm:text-4xl font-black text-abyss mb-5">
                Plombier disponible sur Port-de-Bouc et ses environs
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Diego Rodriguez intervient rapidement dans toute la zone de Port-de-Bouc (13110) et les communes voisines des Bouches-du-Rhône.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {BUSINESS.zones.filter(z => z.primary).map((z) => {
                  const inner = (
                    <>
                      <div className="w-2 h-2 rounded-full bg-kinetic shrink-0" />
                      <span className="font-medium text-abyss">{z.name}</span>
                      <span className="text-slate-400 text-xs">{z.delay}</span>
                    </>
                  );
                  return z.hasPage ? (
                    <Link
                      key={z.name}
                      to={`/plombier-${z.slug}`}
                      className="flex items-center gap-2 text-sm group hover:text-kinetic transition-colors"
                      title={`Plombier ${z.name} — page dédiée`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={z.name} className="flex items-center gap-2 text-sm">
                      {inner}
                    </div>
                  );
                })}
              </div>
              <Link to="/zones" className="inline-flex items-center gap-2 text-kinetic font-bold hover:underline">
                Voir toutes les zones <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 h-80">
              <iframe
                title="Plomberie Rodriguez Diego — Port-de-Bouc"
                src={BUSINESS.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PREUVES DE CONFIANCE */}
      <section className="py-16 bg-abyss">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: <ThumbsUp className="w-8 h-8" />, value: "+50", label: "Avis 5★ Google" },
              { icon: <Wrench className="w-8 h-8" />, value: "100%", label: "Artisan local" },
              { icon: <Shield className="w-8 h-8" />, value: "Garantie Décennale", label: "Assuré & certifié" },
              { icon: <Clock className="w-8 h-8" />, value: "< 48h", label: "Délai d'intervention" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <div className="text-kinetic">{item.icon}</div>
                <div className="text-3xl font-black text-white">{item.value}</div>
                <div className="text-slate-400 text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section className="py-20 bg-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Nos travaux</div>
            <h2 className="text-3xl sm:text-4xl font-black text-abyss mb-4">Réalisations récentes</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Découvrez quelques exemples de chantiers réalisés par Diego Rodriguez dans la zone de Port-de-Bouc.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {BUSINESS.realizations
              .filter((r) => r.imageAfter || r.image)
              .slice(0, 3)
              .map((r) => {
                const cover = r.imageAfter || r.image;
                const hasBeforeAfter = r.imageBefore && r.imageAfter;
                return (
                  <Link
                    key={r.title}
                    to={`/realisations#${slug(r.title)}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all block"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={cover}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-abyss text-white text-xs font-bold px-2 py-1 rounded">{r.type}</div>
                      <div className="absolute top-3 right-3 bg-kinetic text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{r.city}
                      </div>
                      {hasBeforeAfter && (
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-abyss text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
                          Avant / Après ↗
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-abyss mb-2 group-hover:text-kinetic transition-colors">{r.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{r.result}</p>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="text-center">
            <Link to="/realisations" className="inline-flex items-center gap-2 bg-abyss text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Voir toutes les réalisations <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Ce qu'ils disent</div>
            <h2 className="text-3xl sm:text-4xl font-black text-abyss mb-4">Avis clients vérifiés</h2>
            <div className="flex items-center justify-center gap-3">
              <StarRating />
              <span className="font-bold text-abyss text-xl">4.9/5</span>
              <span className="text-slate-500">· +50 avis sur Google</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {topReviews.map((r) => (
              <div key={r.name} className="bg-mist rounded-2xl p-6 border border-slate-100">
                <StarRating n={r.rating} />
                <p className="mt-4 text-slate-700 text-sm leading-relaxed italic">"{r.text}"</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-abyss text-sm">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.city} · {r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-abyss text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir tous les avis Google
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-mist">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-black text-abyss mb-4">Questions fréquentes</h2>
            <p className="text-slate-500">Plombier à Port-de-Bouc — vos questions, nos réponses.</p>
          </div>
          <div className="space-y-3">
            {BUSINESS.faq.slice(0, 5).map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* GOOGLE BUSINESS */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-mist rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ExternalLink className="w-8 h-8 text-kinetic" />
          </div>
          <h2 className="text-2xl font-black text-abyss mb-3">Retrouvez-nous sur Google</h2>
          <p className="text-slate-500 mb-6">Votre satisfaction est notre priorité. Laissez-nous un avis Google pour aider d'autres clients à nous trouver !</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-kinetic text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Voir notre fiche Google
            </a>
            <a
              href={BUSINESS.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-abyss text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              Laisser un avis
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
