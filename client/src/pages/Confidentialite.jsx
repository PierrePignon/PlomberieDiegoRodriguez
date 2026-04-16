import { BUSINESS } from "../lib/business";

export default function Confidentialite() {
  return (
    <section className="py-20 bg-mist">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-abyss mb-2">Politique de confidentialité</h1>
        <div className="w-10 h-1 bg-kinetic rounded mb-8" />
        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-8 text-sm text-slate-600 leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Collecte des données personnelles</h2>
            <p>Dans le cadre de son activité, {BUSINESS.name} collecte uniquement les données nécessaires au traitement de vos demandes (nom, téléphone, email, adresse) via le formulaire de contact et le formulaire de rendez-vous.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Utilisation des données</h2>
            <p>Les données collectées sont utilisées exclusivement pour vous recontacter, établir un devis ou confirmer un rendez-vous. Elles ne sont jamais revendues ni transmises à des tiers.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Durée de conservation</h2>
            <p>Vos données sont conservées le temps nécessaire au traitement de votre demande, et au maximum 3 ans conformément à la législation en vigueur.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Vos droits (RGPD)</h2>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : <a href={`mailto:${BUSINESS.email}`} className="text-kinetic">{BUSINESS.email}</a></p>
          </div>
          <div>
            <h2 className="text-base font-bold text-abyss mb-3">Cookies</h2>
            <p>Ce site n'utilise pas de cookies de traçage commercial. Des cookies techniques peuvent être utilisés pour assurer le bon fonctionnement du site.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
