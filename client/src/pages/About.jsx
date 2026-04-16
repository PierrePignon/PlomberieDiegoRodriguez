import { Link } from "react-router-dom";
import { CheckCircle, Shield, Star, Award, Phone } from "lucide-react";
import { BUSINESS } from "../lib/business";
import CTASection from "../components/shared/CTASection";

export default function About() {
  return (
    <>
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">L'artisan</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Diego Rodriguez</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Artisan plombier et carreleur à Port-de-Bouc, au service des particuliers et professionnels des Bouches-du-Rhône.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                alt="Artisan plombier au travail — Plomberie Rodriguez Diego"
                className="rounded-2xl shadow-2xl w-full object-cover h-96"
                loading="lazy"
              />
            </div>
            <div>
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Présentation</div>
              <h2 className="text-3xl font-black text-abyss mb-5">Un artisan de confiance, ancré dans sa région</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Diego Rodriguez est un artisan plombier et carreleur basé à Port-de-Bouc (13110), dans les Bouches-du-Rhône. Fort de plusieurs années d'expérience dans le bâtiment, il intervient auprès des particuliers et des professionnels pour tous types de travaux de plomberie et de carrelage.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Son approche est simple : un travail soigné, des délais respectés, une communication transparente et des tarifs honnêtes. Diego prend le temps d'expliquer chaque intervention, de proposer la solution la mieux adaptée à votre budget et de s'assurer que vous êtes pleinement satisfait du résultat.
              </p>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex items-center gap-2 bg-kinetic text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors pulse-glow"
              >
                <Phone className="w-5 h-5" />
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Valeurs */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Nos valeurs</div>
              <h2 className="text-3xl font-black text-abyss">Ce qui nous distingue</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <CheckCircle className="w-6 h-6 text-kinetic" />, title: "Transparence", desc: "Devis détaillé avant toute intervention. Pas de mauvaise surprise sur la facture." },
                { icon: <Star className="w-6 h-6 text-kinetic" />, title: "Qualité", desc: "Matériaux sélectionnés, finitions soignées, travail dans les règles de l'art et les normes DTU." },
                { icon: <Shield className="w-6 h-6 text-kinetic" />, title: "Fiabilité", desc: "Ponctualité, respect des délais annoncés, suivi après intervention." },
                { icon: <Award className="w-6 h-6 text-kinetic" />, title: "Expertise", desc: "Plomberie et carrelage maîtrisés de A à Z. Un seul artisan pour tout votre chantier." },
                { icon: <CheckCircle className="w-6 h-6 text-kinetic" />, title: "Local", desc: "Artisan du terroir. Réactivité maximale sur Port-de-Bouc et environs." },
                { icon: <Shield className="w-6 h-6 text-kinetic" />, title: "Assurance RC Pro", desc: "Couverture totale pour vos travaux. Justificatifs disponibles sur demande." },
              ].map((v) => (
                <div key={v.title} className="bg-mist rounded-2xl p-6 border border-slate-100">
                  <div className="mb-4">{v.icon}</div>
                  <h3 className="font-bold text-abyss mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Méthode */}
          <div>
            <div className="text-center mb-12">
              <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Notre méthode</div>
              <h2 className="text-3xl font-black text-abyss">Comment ça se passe ?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {[
                { step: "01", title: "Contact", desc: "Appelez ou remplissez le formulaire. Réponse rapide garantie." },
                { step: "02", title: "Devis gratuit", desc: "Nous évaluons votre besoin et vous envoyons un devis clair et détaillé." },
                { step: "03", title: "Intervention", desc: "Diego intervient à la date convenue, avec le matériel adapté." },
                { step: "04", title: "Suivi", desc: "Vérification de votre satisfaction. Garantie sur les travaux réalisés." },
              ].map((step) => (
                <div key={step.step} className="text-center relative">
                  <div className="w-14 h-14 bg-kinetic rounded-full flex items-center justify-center mx-auto mb-4 text-white font-black text-xl">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-abyss mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
