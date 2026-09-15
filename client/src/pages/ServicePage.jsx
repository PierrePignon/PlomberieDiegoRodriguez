import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Phone, CheckCircle, ChevronRight, Home, ChevronsRight, Star, Shield, Clock, HelpCircle, Wrench } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";
import usePageMeta from "../components/seo/usePageMeta";

const SITE_URL = "https://plomberie-diego-rodriguez.fr";

// Pages services dédiées (SEO local). Une page = un service = une porte d'entrée Google.
export const SERVICE_PAGES = [
  {
    slug: "debouchage",
    emoji: "🪣",
    name: "Débouchage",
    h1: "Débouchage de canalisation à Port-de-Bouc",
    metaTitle: "Débouchage canalisation Port-de-Bouc — WC, évier, urgence | Rodriguez",
    metaDescription:
      "Débouchage à Port-de-Bouc et alentours : WC, évier, douche, canalisation bouchée. Furet électrique, hydrocurage, inspection caméra. Intervention rapide, devis gratuit. ☎ 06 37 75 92 06.",
    intro:
      "WC bouché, évier qui ne s'écoule plus, mauvaises odeurs qui remontent, canalisation obstruée ? À Port-de-Bouc et dans tout le secteur (Martigues, Fos-sur-Mer, Istres…), Diego Rodriguez intervient rapidement avec un matériel professionnel — furet électrique et hydrocureur — pour venir à bout de tous les bouchons, même les plus tenaces. Diagnostic clair, devis gratuit avant intervention, et si besoin une inspection caméra pour localiser précisément l'obstruction.",
    features: [
      "Débouchage WC, évier, douche, baignoire",
      "Hydrocurage haute pression des canalisations",
      "Furet électrique professionnel",
      "Inspection caméra pour localiser le bouchon",
      "Conseils d'entretien préventif contre les récidives",
    ],
    faq: [
      { q: "Combien coûte un débouchage à Port-de-Bouc ?", a: "Le tarif dépend du type de bouchon et de son accessibilité. Nous établissons toujours un devis clair avant d'intervenir, sans surprise. Pour une estimation rapide, appelez le 06 37 75 92 06." },
      { q: "Intervenez-vous en urgence pour un WC ou un évier bouché ?", a: "Oui, un bouchon est souvent urgent. Nous faisons notre maximum pour intervenir le jour même selon nos disponibilités, du lundi au vendredi (8h–18h30), et le samedi matin sur rendez-vous." },
      { q: "Faut-il casser pour déboucher une canalisation ?", a: "Dans la grande majorité des cas, non. Le furet électrique et l'hydrocurage suffisent sans aucune destruction. Si le bouchon est profond, une inspection caméra permet de le localiser avant toute intervention plus poussée." },
      { q: "Le débouchage évite-t-il que ça se rebouche ?", a: "Un hydrocurage nettoie la canalisation en profondeur et limite fortement les récidives, contrairement aux produits chimiques qui n'agissent qu'en surface et abîment les tuyaux. Nous pouvons aussi vous conseiller sur l'entretien préventif." },
    ],
  },
  {
    slug: "recherche-de-fuite",
    emoji: "💧",
    name: "Recherche de fuite",
    h1: "Recherche de fuite à Port-de-Bouc",
    metaTitle: "Recherche de fuite Port-de-Bouc — Détection non destructive | Rodriguez",
    metaDescription:
      "Recherche et détection de fuite à Port-de-Bouc et alentours : méthode non destructive, rapport pour votre assurance, réparation dans la foulée. Devis gratuit. ☎ 06 37 75 92 06.",
    intro:
      "Une tache d'humidité au plafond, une surconsommation d'eau inexpliquée, un mur qui reste froid et humide ? Une fuite non traitée peut causer des dégâts importants. À Port-de-Bouc et dans le secteur, Diego Rodriguez localise l'origine exacte de la fuite grâce à des méthodes de détection non destructives (acoustique, caméra thermique, gaz traceur), sans casser inutilement. Vous recevez un rapport utilisable pour votre assurance, et la réparation peut être réalisée dans la foulée.",
    features: [
      "Détection acoustique et thermique",
      "Aucune destruction inutile",
      "Localisation précise sous chape ou encastré",
      "Rapport d'expertise pour l'assurance",
      "Réparation dans la foulée",
    ],
    faq: [
      { q: "La recherche de fuite abîme-t-elle mes murs ou mon sol ?", a: "Non. Nous utilisons des méthodes non destructives (détection acoustique, caméra thermique, gaz traceur) pour localiser la fuite avec précision avant toute ouverture. On ne casse que si c'est strictement nécessaire, et on remet alors en état à l'identique." },
      { q: "Puis-je utiliser votre rapport pour mon assurance ?", a: "Oui. Nous fournissons un rapport d'expertise détaillé, souvent demandé par les assurances dans le cadre d'un dégât des eaux." },
      { q: "Combien de temps prend une recherche de fuite ?", a: "La plupart des recherches se font en une seule intervention. La durée dépend de la complexité et de l'accessibilité, mais l'objectif est toujours de localiser précisément avant d'intervenir." },
      { q: "Réparez-vous la fuite une fois localisée ?", a: "Oui, dès que la fuite est localisée, nous pouvons procéder à la réparation immédiatement, ce qui vous évite un second rendez-vous." },
    ],
  },
  {
    slug: "chauffe-eau",
    emoji: "🔥",
    name: "Chauffe-eau",
    h1: "Chauffe-eau & eau chaude à Port-de-Bouc",
    metaTitle: "Chauffe-eau & chauffagiste Port-de-Bouc — Réparation, remplacement | Rodriguez",
    metaDescription:
      "Plus d'eau chaude à Port-de-Bouc ? Réparation, remplacement et installation de chauffe-eau (électrique, thermodynamique). Diagnostic rapide, devis gratuit. ☎ 06 37 75 92 06.",
    intro:
      "Plus d'eau chaude, un chauffe-eau qui fuit, qui disjoncte ou qui ne chauffe plus assez ? À Port-de-Bouc et alentours, Diego Rodriguez intervient sur tous les types de chauffe-eau — électrique, thermodynamique, solaire. Après un diagnostic rapide, on répare (résistance, groupe de sécurité, thermostat) ou on remplace l'appareil selon son état, avec un conseil honnête sur ce qui est le plus rentable pour vous.",
    features: [
      "Diagnostic chauffe-eau électrique et thermodynamique",
      "Remplacement du groupe de sécurité qui fuit",
      "Remplacement de résistance et thermostat",
      "Installation de chauffe-eau neuf",
      "Conseil et devis comparatif réparation / remplacement",
    ],
    faq: [
      { q: "Vaut-il mieux réparer ou remplacer mon chauffe-eau ?", a: "Ça dépend de l'âge et de la panne. En dessous de 8-10 ans, la réparation est souvent la bonne option ; au-delà, le remplacement est généralement plus rentable. Nous établissons un diagnostic honnête et un devis comparatif avant de décider avec vous." },
      { q: "Installez-vous les chauffe-eau thermodynamiques ?", a: "Oui, nous installons les chauffe-eau électriques classiques comme les modèles thermodynamiques, plus économiques à l'usage. Nous vous conseillons selon votre logement et votre consommation." },
      { q: "Intervenez-vous en urgence si je n'ai plus d'eau chaude ?", a: "Oui, une panne d'eau chaude est prioritaire. Nous intervenons dès que possible, du lundi au vendredi, pour diagnostiquer et vous dépanner rapidement." },
      { q: "Mon groupe de sécurité goutte en permanence, est-ce grave ?", a: "Un groupe de sécurité qui goutte un peu pendant la chauffe est normal ; s'il coule en continu, c'est une panne courante et rapide à traiter. Nous le remplaçons et vérifions l'ensemble de l'installation." },
    ],
  },
];

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

export default function ServicePage({ slug: propSlug }) {
  const svc = SERVICE_PAGES.find((s) => s.slug === propSlug);
  if (!svc) return <Navigate to="/404" replace />;

  const canonical = `${SITE_URL}/${svc.slug}`;
  const title = svc.metaTitle;
  const description = svc.metaDescription;

  const graph = [
    {
      "@type": "Service",
      "serviceType": svc.name,
      "provider": {
        "@type": "Plumber",
        "@id": `${SITE_URL}/#business`,
        "name": BUSINESS.name,
        "telephone": BUSINESS.phone,
        "url": SITE_URL,
      },
      "areaServed": {
        "@type": "City",
        "name": "Port-de-Bouc",
        "address": { "@type": "PostalAddress", "addressLocality": "Port-de-Bouc", "postalCode": "13110", "addressRegion": "Bouches-du-Rhône", "addressCountry": "FR" },
      },
      "name": `${svc.name} à Port-de-Bouc`,
      "description": description,
      "url": canonical,
    },
  ];
  if (svc.faq && svc.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": svc.faq.map((item) => ({ "@type": "Question", "name": item.q, "acceptedAnswer": { "@type": "Answer", "text": item.a } })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  usePageMeta({ title, description, canonical, jsonLd, jsonLdId: `page-service-${svc.slug}` });

  const others = SERVICE_PAGES.filter((s) => s.slug !== svc.slug);
  const villes = BUSINESS.zones.filter((z) => z.hasPage).slice(0, 6);

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
              <Link to="/services" className="hover:text-kinetic">Services</Link>
            </li>
            <ChevronsRight className="w-3 h-3 text-slate-400" />
            <li className="text-abyss font-semibold">{svc.name}</li>
          </ol>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-abyss py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <span className="text-base leading-none">{svc.emoji}</span>
            {svc.name} · Port-de-Bouc & alentours
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            {svc.h1.replace("Diego Rodriguez", "")} <span className="text-kinetic">Diego Rodriguez</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">{svc.metaDescription.split("☎")[0].trim()}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg pulse-glow">
              <Phone className="w-5 h-5" />
              Appeler — {BUSINESS.phoneDisplay}
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all">
              Demander un devis
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /><span>4,9/5 · +50 avis Google</span></div>
            <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-kinetic" /><span>Garantie décennale</span></div>
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-kinetic" /><span>Intervention sous 24-48h</span></div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">{svc.name} à Port-de-Bouc</div>
          <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-5">Votre artisan pour le {svc.name.toLowerCase()} et les environs</h2>
          <p className="text-slate-700 text-base leading-relaxed">{svc.intro}</p>
        </div>
      </section>

      {/* PRESTATIONS INCLUSES */}
      {svc.features && svc.features.length > 0 && (
        <section className="py-16 bg-mist">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-8 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-kinetic" /> Ce que comprend notre intervention
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {svc.features.map((f) => (
                <div key={f} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-kinetic shrink-0" />
                  <span className="font-medium text-abyss">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {svc.faq && svc.faq.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <HelpCircle className="w-4 h-4" /> FAQ
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-abyss mb-3">Questions fréquentes — {svc.name}</h2>
              <p className="text-slate-500 text-sm">Les questions qu'on nous pose le plus souvent sur le {svc.name.toLowerCase()} à Port-de-Bouc.</p>
            </div>
            <div className="space-y-3">
              {svc.faq.map((item) => (<FAQItem key={item.q} q={item.q} a={item.a} />))}
            </div>
          </div>
        </section>
      )}

      {/* CTA TÉLÉPHONE */}
      <section className="py-16 bg-abyss">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Besoin d'un {svc.name.toLowerCase()} à Port-de-Bouc ?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Appelez Diego Rodriguez pour un devis gratuit ou une intervention rapide. Réponse sous quelques heures.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`tel:${BUSINESS.phone}`} className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
              <Phone className="w-5 h-5" /> {BUSINESS.phoneDisplay}
            </a>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-bold transition-all">
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>

      {/* MAILLAGE INTERNE : autres services + villes */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-abyss mb-5 text-center">Nos autres prestations</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {others.map((s) => (
              <Link key={s.slug} to={`/${s.slug}`} className="text-sm bg-mist hover:bg-kinetic hover:text-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
                {s.emoji} {s.name}
              </Link>
            ))}
            <Link to="/services" className="text-sm bg-mist hover:bg-abyss hover:text-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
              Tous les services
            </Link>
          </div>
          <h2 className="text-lg font-bold text-abyss mb-5 text-center">Zones d'intervention</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {villes.map((z) => (
              <Link key={z.slug} to={`/plombier-${z.slug}`} className="text-sm bg-mist hover:bg-kinetic hover:text-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 transition-colors">
                Plombier {z.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
