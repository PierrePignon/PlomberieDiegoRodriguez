import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ExternalLink, Navigation, MessageCircle, CheckCircle } from "lucide-react";
import { BUSINESS } from "../lib/business";
import { sendEmail } from "../lib/emailService";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", service: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendEmail({
        to: BUSINESS.notifEmail,
        subject: `📋 Nouvelle demande de devis — ${form.name}`,
        body: [
          `👤 Nom        : ${form.name}`,
          `📞 Téléphone  : ${form.phone}`,
          `📧 Email      : ${form.email || 'Non renseigné'}`,
          `🔧 Service    : ${form.service || 'Non précisé'}`,
          `💬 Message : ${form.message}`,
        ].join('\n'),
      });
    } catch (err) {
      console.error("EmailJS erreur complète :", err);
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">Nous joindre</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">Contact & Devis gratuit</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Pour une fuite, une rénovation ou tout autre besoin en plomberie et carrelage — contactez Diego Rodriguez à Port-de-Bouc.
          </p>
        </div>
      </section>

      <section className="py-20 bg-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <h2 className="text-2xl font-black text-abyss mb-6">Demander un devis gratuit</h2>
              {sent ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-abyss mb-2">Message envoyé !</div>
                    <p className="text-slate-500">Diego vous recontactera très rapidement. Merci de votre confiance.</p>
                  </div>
                  <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 bg-kinetic text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
                    <Phone className="w-4 h-4" />
                    Appeler directement
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-abyss mb-1.5">Nom *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Votre nom"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-abyss mb-1.5">Téléphone *</label>
                      <input
                        required
                        value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                        placeholder="06 xx xx xx xx"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-abyss mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="votre@email.fr"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-abyss mb-1.5">Type de prestation</label>
                    <select
                      value={form.service}
                      onChange={e => setForm({...form, service: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors bg-white"
                    >
                      <option value="">Sélectionner...</option>
                      {BUSINESS.services.map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-abyss mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      placeholder="Décrivez votre problème ou votre projet..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-kinetic text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors disabled:opacity-60"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer ma demande gratuite"}
                  </button>
                </form>
              )}
            </div>

            {/* Coordonnées */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                <h2 className="text-xl font-black text-abyss mb-6">Coordonnées</h2>
                <div className="space-y-4">
                  <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-kinetic rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Téléphone</div>
                      <div className="font-bold text-abyss group-hover:text-kinetic transition-colors">{BUSINESS.phoneDisplay}</div>
                    </div>
                  </a>
                  <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-abyss rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Email</div>
                      <div className="font-bold text-abyss group-hover:text-kinetic transition-colors">{BUSINESS.email}</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-abyss" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Adresse</div>
                      <div className="font-bold text-abyss">{BUSINESS.fullAddress}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-abyss" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Horaires</div>
                      <div className="font-bold text-abyss">{BUSINESS.hours}</div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${BUSINESS.whatsapp}?text=Bonjour Diego, j'ai besoin d'un plombier.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">WhatsApp</div>
                      <div className="font-bold text-green-600 hover:text-green-700 transition-colors">Envoyer un message</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Google Links */}
              <div className="bg-abyss rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Retrouvez-nous sur Google</h3>
                <div className="space-y-3">
                  <a
                    href={BUSINESS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-kinetic hover:text-orange-400 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir notre fiche Google Business
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS.fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Obtenir l'itinéraire
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-60">
                <iframe
                  title="Localisation Plomberie Rodriguez Diego"
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
        </div>
      </section>
    </>
  );
}
