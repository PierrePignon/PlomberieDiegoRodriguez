import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { google } from "googleapis";

const router = express.Router();

// Un seul créneau par jour : 11h30 → 12h30 (60 min)
// Diego ne prend des RDV que sur ce créneau, le reste du temps il est sur chantier.
const SLOTS = ["11:30"];

// Jours ouvrés pour la prise de RDV : lundi → jeudi uniquement
// (le frontend filtre déjà côté UI, mais on protège aussi côté backend)
const ALLOWED_DAYS_OF_WEEK = [1, 2, 3, 4]; // 0=dimanche, 6=samedi

const TIMEZONE = "Europe/Paris";

// Lazy init : on ne throw plus au load du module.
// Si une secret manque, le serveur démarre quand même (pour /healthz)
// et les routes /api/* retournent 500 propre.
let _calendarClient = null;
let _calendarClientError = null;

function getCalendarClient() {
  if (_calendarClient) return _calendarClient;
  if (_calendarClientError) throw _calendarClientError;

  const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

  const missing = [];
  if (!CALENDAR_ID) missing.push("GOOGLE_CALENDAR_ID");
  if (!GOOGLE_CLIENT_EMAIL) missing.push("GOOGLE_CLIENT_EMAIL");
  if (!GOOGLE_PRIVATE_KEY) missing.push("GOOGLE_PRIVATE_KEY");

  if (missing.length > 0) {
    const err = new Error(
      `Variables d'environnement manquantes : ${missing.join(", ")}. ` +
      `Configurez-les via 'fly secrets set' puis redéployez.`
    );
    err.code = "MISSING_SECRETS";
    _calendarClientError = err;
    throw err;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  _calendarClient = {
    calendar: google.calendar({ version: "v3", auth }),
    calendarId: CALENDAR_ID,
  };

  return _calendarClient;
}

function buildSlotDate(date, slot) {
  const [hour, minute] = slot.split(":").map(Number);

  const start = new Date(`${date}T00:00:00`);
  start.setHours(hour, minute, 0, 0);

  return start;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

async function getBusyRanges(date) {
  const { calendar, calendarId } = getCalendarClient();

  const timeMin = new Date(`${date}T00:00:00+02:00`);
  const timeMax = new Date(`${date}T23:59:59+02:00`);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  return response.data.calendars[calendarId]?.busy || [];
}

async function getAvailableSlots(date, durationMinutes = 60) {
  // Sécurité : refuser les jours hors lun-jeu, même si la requête arrive
  const dayObj = new Date(`${date}T00:00:00`);
  const dow = dayObj.getDay();
  if (!ALLOWED_DAYS_OF_WEEK.includes(dow)) {
    return [];
  }

  const busyRanges = await getBusyRanges(date);

  const availableSlots = SLOTS.filter((slot) => {
    const start = buildSlotDate(date, slot);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const isBusy = busyRanges.some((busy) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return overlaps(start, end, busyStart, busyEnd);
    });

    return !isBusy;
  });

  return availableSlots;
}

router.get("/availability", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: "Paramètre 'date' manquant.",
      });
    }

    const slots = await getAvailableSlots(date, 60);

    console.log(`[availability] date=${date} slots=${slots.length}/${SLOTS.length}`);

    return res.json({
      date,
      slots,
    });
  } catch (error) {
    console.error("Erreur /availability :", error);

    if (error.code === "MISSING_SECRETS") {
      return res.status(503).json({
        error: "Service de réservation temporairement indisponible. Contactez Diego par téléphone : 06 37 75 92 06.",
      });
    }

    return res.status(500).json({
      error: "Impossible de charger les disponibilités.",
    });
  }
});

router.post("/book-appointment", async (req, res) => {
  try {
    const { date, slot, durationMinutes = 60, customer } = req.body;

    if (!date || !slot || !customer?.name || !customer?.phone) {
      return res.status(400).json({
        error: "Données manquantes pour la réservation.",
      });
    }

    const availableSlots = await getAvailableSlots(date, durationMinutes);

    if (!availableSlots.includes(slot)) {
      return res.status(409).json({
        error: "Ce créneau n'est plus disponible.",
      });
    }

    const start = buildSlotDate(date, slot);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const { calendar, calendarId } = getCalendarClient();

    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `RDV Plomberie — ${customer.name}`,
        description: [
          `Client : ${customer.name}`,
          `Téléphone : ${customer.phone}`,
          `Email : ${customer.email || "Non renseigné"}`,
          `Adresse : ${customer.address || "Non renseignée"}`,
          `Besoin : ${customer.message || "Non précisé"}`,
        ].join("\n"),
        start: {
          dateTime: start.toISOString(),
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: TIMEZONE,
        },
        location: customer.address || "Port-de-Bouc",
      },
    });

    console.log(
      `[book-appointment] ✅ RDV créé — ${customer.name} (${customer.phone}) ` +
      `le ${date} à ${slot} | eventId=${event.data.id}`
    );

    return res.json({
      success: true,
      eventId: event.data.id,
      htmlLink: event.data.htmlLink,
      message: "Rendez-vous réservé avec succès.",
    });
  } catch (error) {
    console.error("Erreur /book-appointment :", error);

    if (error.code === "MISSING_SECRETS") {
      return res.status(503).json({
        error: "Service de réservation temporairement indisponible. Contactez Diego par téléphone : 06 37 75 92 06.",
      });
    }

    return res.status(500).json({
      error: "Impossible de créer le rendez-vous.",
    });
  }
});

export default router;
