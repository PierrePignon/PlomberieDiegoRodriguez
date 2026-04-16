import { Phone, MessageCircle, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS } from "../../lib/business";

export default function MobileBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-abyss border-t border-slate-700 safe-area-inset-bottom">
      <div className="grid grid-cols-4 h-16">
        <a
          href={`tel:${BUSINESS.phone}`}
          className="flex flex-col items-center justify-center gap-1 text-white bg-kinetic hover:bg-orange-700 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-bold">Appeler</span>
        </a>
        <a
          href={`https://wa.me/${BUSINESS.whatsapp}?text=Bonjour, je souhaite un devis plomberie.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">WhatsApp</span>
        </a>
        <Link
          to="/contact"
          className="flex flex-col items-center justify-center gap-1 text-white bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">Devis</span>
        </Link>
        <Link
          to="/rendez-vous"
          className="flex flex-col items-center justify-center gap-1 text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold">RDV</span>
        </Link>
      </div>
    </div>
  );
}
