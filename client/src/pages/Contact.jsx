import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Navigation,
  MessageCircle,
  CheckCircle,
  Send,
  Maximize2,
  Crosshair,
  ZoomIn,
} from "lucide-react";
import { BUSINESS } from "../lib/business";
import PhotoUploadField from "../components/contact/PhotoUploadField";

const BACKEND_URL = "https://rodriguez-backend.fly.dev";

// Plus d'URLs d'exemple — on utilise une illustration SVG schématique
// indépendante de toute source externe (PhotoExampleIllustration).

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    message: "",
  });
  const [photos, setPhotos] = useState({
    photoLarge: null,
    photoMedium: null,
    photoClose: null,
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      Object.entries(photos).forEach(([k, file]) => {
        if (file) data.append(k, file);
      });

      const res = await fetch(`${BACKEND_URL}/api/quote-request`, {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur lors de l'envoi.");
      setSent(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Impossible d'envoyer la demande.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <section className="min-h-screen bg-mist py-20 px-4 flex items-center">
        <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-abyss mb-3">
            Demande envoyée !
          </h2>
          <p className="text-slate-600 mb-2">
            Diego a bien reçu votre demande et vos photos.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Vous serez recontacté par téléphone dans les 24h pour confirmer le devis.
          </p>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="inline-flex items-center justify-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-6 py-3.5 rounded-xl font-bold w-full transition-colors"
          >
            <Phone className="w-4 h-4" />
            Ou appeler directement {BUSINESS.phoneDisplay}
          </a>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-abyss py-20 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-kinetic font-bold text-sm uppercase tracking-widest mb-3">
            Devis gratuit
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-5">
            Décrivez votre projet en photos
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Quelques infos, 3 photos guidées, et Diego revient vers vous avec un devis précis dans les 24h.
          </p>
        </div>
      </section>

      <section className="py-16 bg-mist">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* COLONNE FORMULAIRE */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              {/* Étape : Coordonnées */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-abyss text-white font-black flex items-center justify-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-abyss">Vos coordonnées</h3>
                    <p className="text-sm text-slate-500">Pour vous recontacter rapidement</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-abyss mb-1.5 uppercase tracking-wide">
                      Nom *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-abyss mb-1.5 uppercase tracking-wide">
                      Téléphone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="06 xx xx xx xx"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-abyss mb-1.5 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="votre@email.fr"
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-abyss mb-1.5 uppercase tracking-wide">
                      Adresse / Ville
                    </label>
                    <input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Port-de-Bouc, Martigues..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-abyss mb-1.5 uppercase tracking-wide">
                    Type de prestation
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors bg-white"
                  >
                    <option value="">Sélectionner...</option>
                    {BUSINESS.services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-abyss mb-1.5 uppercase tracking-wide">
                    Décrivez votre besoin *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Quel est le problème ? Depuis quand ? Avez-vous des contraintes particulières (urgence, accessibilité...) ?"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-kinetic transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Étape B : Photos */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-abyss text-white font-black flex items-center justify-center">
                    B
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-abyss">Vos 3 photos</h3>
                    <p className="text-sm text-slate-500">
                      Plus les photos sont précises, plus le devis est juste
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-900 mt-3 mb-5">
                  <strong>💡 Pourquoi 3 photos ?</strong> Une vue large pour comprendre le contexte,
                  une vue intermédiaire pour situer le problème, un gros plan pour voir le détail
                  exact. Diego peut chiffrer précisément depuis son chantier sans devoir vous redemander.
                </div>
              </div>

              <PhotoUploadField
                number={1}
                icon={Maximize2}
                title="Vue large"
                instruction="Toute la pièce ou l'environnement concerné"
                tip="Reculez de 2-3 m pour qu'on voie l'ensemble"
                level="large"
                value={photos.photoLarge}
                onChange={(file) => setPhotos((p) => ({ ...p, photoLarge: file }))}
                accent="orange"
              />

              <PhotoUploadField
                number={2}
                icon={Crosshair}
                title="Vue intermédiaire"
                instruction="La zone du problème, à environ 1 m de distance"
                tip="On doit voir clairement où se trouve le problème"
                level="medium"
                value={photos.photoMedium}
                onChange={(file) => setPhotos((p) => ({ ...p, photoMedium: file }))}
                accent="blue"
              />

              <PhotoUploadField
                number={3}
                icon={ZoomIn}
                title="Vue précise"
                instruction="Gros plan sur la fuite, le défaut ou le détail exact"
                tip="Approchez à 20-30 cm — la zone doit être nette"
                level="close"
                value={photos.photoClose}
                onChange={(file) => setPhotos((p) => ({ ...p, photoClose: file }))}
                accent="green"
              />

              {/* Erreur globale */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-kinetic hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2 shadow-xl"
              >
                {loading ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer ma demande de devis
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Diego revient vers vous par téléphone dans les 24h. Devis 100% gratuit et sans engagement.
              </p>
            </form>

            {/* COLONNE INFOS — Coordonnées + carte */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-black text-abyss mb-5">Préférez nous appeler ?</h2>
                <div className="space-y-4">
                  <a
                    href={`tel:${BUSINESS.phone}`}
                    className="flex items-center gap-4 group bg-kinetic/5 hover:bg-kinetic/10 p-3 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-kinetic rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Téléphone</div>
                      <div className="font-black text-abyss group-hover:text-kinetic transition-colors">
                        {BUSINESS.phoneDisplay}
                      </div>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${BUSINESS.whatsapp}?text=Bonjour Diego, j'ai besoin d'un plombier.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group p-3 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">WhatsApp</div>
                      <div className="font-bold text-green-700 group-hover:text-green-800 transition-colors">
                        Envoyer un message
                      </div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="flex items-center gap-4 group p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-abyss rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-400 mb-0.5">Email</div>
                      <div className="font-bold text-abyss group-hover:text-kinetic transition-colors text-sm truncate">
                        {BUSINESS.email}
                      </div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 p-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-abyss" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Adresse</div>
                      <div className="font-bold text-abyss text-sm">{BUSINESS.fullAddress}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-abyss" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Horaires</div>
                      <div className="font-bold text-abyss text-sm">{BUSINESS.hours}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Business links */}
              <div className="bg-abyss rounded-2xl p-6">
                <h3 className="text-white font-black mb-4">Sur Google</h3>
                <div className="space-y-3">
                  <a
                    href={BUSINESS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-kinetic hover:text-orange-400 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Voir notre fiche Google
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
