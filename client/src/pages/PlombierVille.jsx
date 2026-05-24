import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Phone, MapPin, Clock, CheckCircle, ChevronRight, Home, ChevronsRight, Star, Wrench, Shield, HelpCircle } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";
import usePageMeta from "../components/seo/usePageMeta";

const SITE_URL = "https://plomberie-diego-rodriguez.fr";

// Item FAQ accordéon (cohérent avec celui de la Home).
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-mist transition-colors"
        aria-expanded={open}
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

export default function PlombierVille({ slug: propSlug }) {
  // Le slug peut venir d'une prop (routes explicites générées dans App.jsx)
  // ou d'un param d'URL (fallback compatibilité).
  const params = useParams();
  const slug = propSlug || params.slug;
  const ville = BUSINESS.zones.find((z) => z.slug === slug && z.hasPage);

  // Slug inconnu ou ville sans page dédiée → 404
  if (!ville) {
    return <Navigate to="/404" replace />;
  }

  // Services à mettre en avant pour cette ville
  const services = (ville.servicesPhares || ["depannage", "renovation", "fuite", "sanitaire"])
    .map((id) => BUSINESS.services.find((s) => s.id === id))
    .filter(Boolean);

  const canonical = `${SITE_URL}/plombier-${ville.slug}`;
  const title = `Plombier ${ville.name} (${ville.postalCode}) — Dépannage, Rénovation | Diego Rodriguez`;
  const description = `Plombier artisan à ${ville.name} (${ville.postalCode}). Dépannage plomberie, recherche de fuite, rénovation salle de bain, carrelage. Devis gratuit, intervention rapide depuis Port-de-Bouc. ☎ 06 37 75 92 06.`;

  // Schema.org : Service + FAQPage (combinés via @graph) pour rich snippets Google.
  const serviceSchema = {
    "@type": "Service",
    "serviceType": "Plomberie, dépannage, rénovation salle de bain",
    "provider": {
      "@type": "Plumber",
      "@id": `${SITE_URL}/#business`,
      "name": BUSINESS.name,
      "telephone": BUSINESS.phone,
      "url": SITE_URL,
    },
    "areaServed": {
      "@type": "City",
      "name": ville.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": ville.name,
        "postalCode": ville.postalCode,
        "addressRegion": "Bouches-du-Rhône",
        "addressCountry": "FR",
      },
    },
    "name": `Plombier ${ville.name}`,
    "description": description,
    "url": canonical,
  };

  const graph = [serviceSchema];
  if (ville.faq && ville.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": ville.faq.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": { "@type": "Answer", "text": item.a },
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  usePageMeta({ title, description, canonical, jsonLd, jsonLdId: `page-ville-${ville.slug}` });

  return (
    <>
      {/* BREADCRUMB */}
      <nav aria-label="Fil d'Ariane" className="bg-mist border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
            <li>
              <Link to="/" className="hover:text-kinetic flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Accueil
              </Link>
            </li>
            <ChevronsRight className="w-3 h-3 text-slate-400" />
            <li>
              <Link to="/zones" className="hover:text-kinetic">
                Zones d'intervention
              </Link>
            </li>
            <ChevronsRight className="w-3 h-3 text-slate-400" />
            <li className="text-abyss font-semibold">Plombier {ville.name}</li>
          </ol>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-abyss py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <MapPin className="w-3.5 h-3.5 text-kinetic" />
            {ville.name} ({ville.postalCode}) · {ville.delay}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Plombier à {ville.name} — <span className="text-kinetic">Diego Rodriguez</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            Artisan plombier installé à Port-de-Bouc, j'interviens à {ville.name} pour vos dépannages plomberie, rénovations de salle de bain et travaux de carrelage. Devis gratuit, intervention rapide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg pulse-glow"
            >
              <Phone className="w-5 h-5" />
              Appeler — {BUSINESS.phoneDisplay}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all"
            >
              Demander un devis
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>4,9/5 · +50 avis Google</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-kinetic" />
              <span>Garantie décennale</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-kinetic" />
              <span>Intervention sous 24-48h</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION SPÉCIFIQUE VILLE */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">
            Intervention plomberie à {ville.name}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-5">
            Votre plombier de proximité à {ville.name}
          </h2>
          <p className="text-slate-700 text-base leading-relaxed mb-6">
            {ville.intro}
          </p>
          {ville.distanceKm && (
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 bg-mist px-4 py-2 rounded-lg">
                <MapPin className="w-4 h-4 text-kinetic" />
                <span><strong>{ville.distanceKm} km</strong> depuis Port-de-Bouc</span>
              </div>
              <div className="flex items-center gap-2 bg-mist px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-kinetic" />
                <span>Temps d'intervention : <strong>{ville.delay}</strong></span>
              </div>
              {ville.population && (
                <div className="flex items-center gap-2 bg-mist px-4 py-2 rounded-lg">
                  <span>👥</span>
                  <span>{ville.population}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* QUARTIERS DESSERVIS */}
      {ville.quartiers && ville.quartiers.length > 0 && (
        <section className="py-16 bg-mist">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-3">
              Quartiers de {ville.name} desservis
            </h2>
            <p className="text-slate-600 mb-8">
              Diego Rodriguez intervient dans tous les quartiers de {ville.name} pour vos urgences plomberie et travaux planifiés :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ville.quartiers.map((q) => (
                <div
                  key={q}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-kinetic shrink-0" />
                  <span className="font-medium text-abyss">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HABITAT & SPÉCIFICITÉS LOCALES */}
      {(ville.habitat || ville.specificites) && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
            {ville.habitat && (
              <div>
                <h3 className="text-xl font-black text-abyss mb-4 flex items-center gap-2">
                  <Home className="w-5 h-5 text-kinetic" />
                  Habitat local
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{ville.habitat}</p>
              </div>
            )}
            {ville.specificites && (
              <div>
                <h3 className="text-xl font-black text-abyss mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-kinetic" />
                  Problématiques plomberie typiques
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{ville.specificites}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SERVICES PHARES POUR CETTE VILLE */}
      {services.length > 0 && (
        <section className="py-16 bg-mist">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Nos prestations</div>
              <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-3">
                Services plomberie proposés à {ville.name}
              </h2>
              <p className="text-slate-500">Une seule équipe pour tous vos besoins plomberie, salle de bain et carrelage.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s) => (
                <Link
                  key={s.id}
                  to="/services"
                  className="bg-white rounded-xl p-6 border border-slate-100 hover:border-kinetic hover:shadow-lg transition-all group"
                >
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <h3 className="font-bold text-abyss mb-2 group-hover:text-kinetic transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.short}</p>
                  <div className="mt-4 text-kinetic text-xs font-bold flex items-center gap-1">
                    En savoir plus <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-abyss hover:text-kinetic font-bold text-sm"
              >
                Voir l'ensemble des services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ SPÉCIFIQUE VILLE */}
      {ville.faq && ville.faq.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <HelpCircle className="w-4 h-4" />
                FAQ
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-3">
                Questions fréquentes — Plombier à {ville.name}
              </h2>
              <p className="text-slate-500 text-sm">
                Réponses aux questions qu'on nous pose le plus souvent sur nos interventions à {ville.name}.
              </p>
            </div>
            <div className="space-y-3">
              {ville.faq.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA TÉLÉPHONE FORT */}
      <section className="py-16 bg-abyss">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Besoin d'un plombier à {ville.name} ?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Appelez Diego Rodriguez pour un devis gratuit ou une intervention rapide à {ville.name} et dans ses environs. Réponse sous quelques heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg"
            >
              <Phone className="w-5 h-5" />
              {BUSINESS.phoneDisplay}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>

      {/* AUTRES VILLES DESSERVIES — maillage interne SEO */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-abyss mb-5 text-center">
            Diego Rodriguez intervient également dans :
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {BUSINESS.zones
              .filter((z) => z.hasPage && z.slug !== ville.slug)
              .map((z) => (
                <Link
                  key={z.slug}
                  to={`/plombier-${z.slug}`}
                  className="text-sm bg-mist hover:bg-kinetic hover:text-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors"
                >
                  Plombier {z.name}
                </Link>
              ))}
            <Link
              to="/"
              className="text-sm bg-mist hover:bg-abyss hover:text-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors"
            >
              Plombier Port-de-Bouc
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
