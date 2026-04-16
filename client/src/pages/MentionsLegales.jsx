import { BUSINESS } from "../lib/business";

export default function MentionsLegales() {
  return (
    <section className="py-20 bg-mist">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-abyss mb-2">Mentions légales</h1>
        <div className="w-10 h-1 bg-kinetic rounded mb-8" />
        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-8 text-sm text-slate-600 leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Éditeur du site</h2>
            <p><strong>Raison sociale :</strong> {BUSINESS.name}</p>
            <p><strong>Gérant :</strong> {BUSINESS.owner}</p>
            <p><strong>Adresse :</strong> {BUSINESS.fullAddress}</p>
            <p><strong>Téléphone :</strong> {BUSINESS.phoneDisplay}</p>
            <p><strong>Email :</strong> {BUSINESS.email}</p>
            <p><strong>SIRET :</strong> [À compléter]</p>
            <p><strong>Assurance RC Pro :</strong> [À compléter]</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Hébergeur</h2>
            <p>Ce site est hébergé par Base44 — www.base44.com</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble des contenus de ce site (textes, images, structure) est la propriété exclusive de {BUSINESS.name}. Toute reproduction est interdite sans autorisation écrite.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Responsabilité</h2>
            <p>{BUSINESS.name} ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
