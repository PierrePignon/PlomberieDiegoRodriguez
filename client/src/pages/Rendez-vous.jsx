import { useState } from "react";
import { Calendar, Clock, CheckCircle, Phone, ChevronRight, ChevronLeft } from "lucide-react";
import { BUSINESS } from "../lib/business";

const DAYS_AHEAD = 14;

function getWorkingDays() {
  const days = [];
  let d = new Date();
  d.setDate(d.getDate() + 1);

  while (days.length < DAYS_AHEAD) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }

  return days;
}

function formatDay(d) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDayShort(d) {
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

function formatApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function RendezVous() {
  const days = getWorkingDays();

  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const FILL = { 1: "25%", 2: "50%", 3: "75%", 4: "100%" };

  async function fetchAvailability(day) {
    try {
      setLoadingSlots(true);
      setErrorMsg("");
      setSelectedSlot(null);

      const date = formatApiDate(day);

      const res = await fetch(`http://localhost:4000/api/availability?date=${date}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur chargement disponibilités");
      }

      setAvailableSlots(data.slots || []);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
      setErrorMsg("Impossible de charger les disponibilités.");
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleDaySelect(day) {
    setSelectedDay(day);
    setStep(2);
    await fetchAvailability(day);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDay || !selectedSlot) {
      setErrorMsg("Merci de sélectionner une date et un créneau.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const date = formatApiDate(selectedDay);

      const res = await fetch("http://localhost:4000/api/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          slot: selectedSlot,
          durationMinutes: 60,
          customer: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la réservation.");
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Erreur lors de la réservation.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-12 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-3">
            Rendez-vous confirmé !
          </h2>

          <p className="text-slate-600 mb-2">
            Votre rendez-vous est prévu le{" "}
            <strong>
              {formatDay(selectedDay)} à {selectedSlot}
            </strong>
            .
          </p>

          <p className="text-slate-500 mb-6">
            {BUSINESS.owner} vous recontactera si besoin.
          </p>

          <a
            href={`tel:${BUSINESS.phone}`}
            className="inline-flex items-center justify-center rounded-xl bg-orange-500 text-white px-5 py-3 font-bold hover:bg-orange-600 transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            Appeler {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Prendre rendez-vous
            </h1>
            <p className="text-slate-600">
              Réservez un créneau disponible avec {BUSINESS.owner}.
            </p>

            <div className="mt-6">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: FILL[step] }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {errorMsg && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                {errorMsg}
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-bold text-slate-900">
                    1. Choisissez une date
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {days.map((day) => (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDaySelect(day)}
                      className="rounded-xl border-2 border-slate-200 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all px-4 py-4 text-left"
                    >
                      <div className="text-sm text-slate-500 capitalize">
                        {formatDay(day)}
                      </div>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        {formatDayShort(day)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && selectedDay && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-slate-900">
                      2. Choisissez un créneau
                    </h2>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                </div>

                <p className="text-slate-600 mb-4 capitalize">
                  Date sélectionnée : <strong>{formatDay(selectedDay)}</strong>
                </p>

                {loadingSlots ? (
                  <p className="text-slate-500">Chargement des créneaux...</p>
                ) : availableSlots.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-slate-700">
                      Aucun créneau disponible pour cette date.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-3 text-orange-600 font-medium hover:underline"
                    >
                      Choisir une autre date
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setStep(3);
                        }}
                        className="rounded-xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all px-4 py-4 font-bold text-slate-900"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && selectedDay && selectedSlot && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    3. Vos informations
                  </h2>

                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                </div>

                <div className="mb-6 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-slate-700">
                  <strong>Rendez-vous :</strong> {formatDay(selectedDay)} à {selectedSlot}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(4);
                  }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Nom complet *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <input
                    type="tel"
                    placeholder="Téléphone *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <input
                    type="text"
                    placeholder="Adresse"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <textarea
                    placeholder="Décrivez votre besoin"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-orange-500 text-white px-6 py-3 font-bold hover:bg-orange-600 transition-colors"
                    >
                      Continuer
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 4 && selectedDay && selectedSlot && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    4. Confirmation
                  </h2>

                  <button
                    onClick={() => setStep(3)}
                    className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 mb-6 space-y-2">
                  <p><strong>Date :</strong> {formatDay(selectedDay)}</p>
                  <p><strong>Heure :</strong> {selectedSlot}</p>
                  <p><strong>Nom :</strong> {form.name}</p>
                  <p><strong>Téléphone :</strong> {form.phone}</p>
                  <p><strong>Email :</strong> {form.email || "Non renseigné"}</p>
                  <p><strong>Adresse :</strong> {form.address || "Non renseignée"}</p>
                  <p><strong>Besoin :</strong> {form.message || "Non précisé"}</p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full rounded-xl bg-orange-500 text-white px-6 py-4 font-bold hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loading ? "Réservation en cours..." : "Confirmer le rendez-vous"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
