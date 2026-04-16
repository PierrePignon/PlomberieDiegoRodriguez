import { Phone, FileText, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS } from "../../lib/business";

export default function CTASection({ title = "Besoin d'un plombier à Port-de-Bouc ?", subtitle = "Devis gratuit sous 24h — Intervention rapide — Artisan certifié" }) {
  return (
    <section className="bg-kinetic py-16 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-bg opacity-20" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2>
        <p className="text-orange-100 text-lg mb-8">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center justify-center gap-3 bg-white text-kinetic px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-xl pulse-glow"
          >
            <Phone className="w-6 h-6" />
            {BUSINESS.phoneDisplay}
          </a>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-3 bg-abyss text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl"
          >
            <FileText className="w-5 h-5" />
            Demander un devis gratuit
          </Link>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=Bonjour, je souhaite un devis plomberie.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
