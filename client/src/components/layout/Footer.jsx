import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { BUSINESS } from "../../lib/business";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-abyss text-slate-300">
      {/* NAP Stamp */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src={BUSINESS.logo} alt="Plomberie Rodriguez Diego" className="h-14 w-auto" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Artisan plombier à Port-de-Bouc depuis plusieurs années. Plomberie, rénovation salle de bain, carrelage. Devis gratuit.
              </p>
              <div className="inline-flex items-center gap-2 border-2 border-kinetic text-kinetic px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide">
                ✓ Artisan certifié — 13110
              </div>
            </div>

            {/* Coordonnées NAP */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Coordonnées</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-kinetic mt-0.5 shrink-0" />
                  <span>{BUSINESS.fullAddress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-kinetic shrink-0" />
                  <a href={`tel:${BUSINESS.phone}`} className="hover:text-white transition-colors font-medium">
                    {BUSINESS.phoneDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-kinetic shrink-0" />
                  <a href={`mailto:${BUSINESS.email}`} className="hover:text-white transition-colors">
                    {BUSINESS.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-kinetic mt-0.5 shrink-0" />
                  <span>{BUSINESS.hours}</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Navigation</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Accueil", to: "/" },
                  { label: "Nos Services", to: "/services" },
                  { label: "Réalisations", to: "/realisations" },
                  { label: "Zone d'intervention", to: "/zones" },
                  { label: "Avis clients", to: "/avis" },
                  { label: "Contact & Devis", to: "/contact" },
                  { label: "Rendez-vous", to: "/rendez-vous" },
                ].map((l) => (
                  <div key={l.to}>
                    <Link to={l.to} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                      → {l.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Google + Zone */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Zone principale</h3>
              <div className="flex flex-wrap gap-1 mb-5">
                {BUSINESS.zones.filter(z => z.primary).map((z) => (
                  <span key={z.name} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                    {z.name}
                  </span>
                ))}
              </div>
              <a
                href={BUSINESS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-kinetic hover:text-orange-400 transition-colors font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Voir sur Google Maps
              </a>
              <div className="mt-3 text-xs text-slate-500">
                <div className="font-medium text-slate-400">Schema.org LocalBusiness</div>
                <div>SIRET : [À compléter]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {year} {BUSINESS.name} — Tous droits réservés</span>
          <div className="flex gap-4">
            <Link to="/mentions-legales" className="hover:text-slate-300 transition-colors">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-slate-300 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
