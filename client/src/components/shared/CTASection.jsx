import { Phone, FileText, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS } from "../../lib/business";

/**
 * CTA Section — fond noir profond + accents or.
 * Même palette que le logo de Diego (noir + or), pour une sensation
 * premium et artisan haut de gamme (plutôt que criard).
 */
export default function CTASection({
  title = "Besoin d'un plombier à Port-de-Bouc ?",
  subtitle = "Devis gratuit sous 24h — Intervention rapide — Artisan certifié",
}) {
  return (
    <section className="relative bg-gradient-to-br from-abyss via-slate-900 to-abyss py-20 overflow-hidden">
      {/* Halo doré discret en arrière-plan pour la chaleur */}
      <div className="absolute inset-0 bg-gradient-to-br from-kinetic/5 via-transparent to-kinetic/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-kinetic/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute inset-0 blueprint-bg opacity-10" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Petit chip or élégant */}
        <div className="inline-flex items-center gap-2 bg-kinetic/10 border border-kinetic/30 text-kinetic text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          Contact direct
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center justify-center gap-3 bg-kinetic hover:brightness-110 text-abyss px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl whitespace-nowrap"
          >
            <Phone className="w-5 h-5" />
            {BUSINESS.phoneDisplay}
          </a>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-kinetic/50 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
          >
            <FileText className="w-5 h-5" />
            Demander un devis
          </Link>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=Bonjour, je souhaite un devis plomberie.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
