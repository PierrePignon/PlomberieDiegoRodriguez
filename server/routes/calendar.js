import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { google } from "googleapis";

const router = express.Router();

const SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const TIMEZONE = "Europe/Paris";

// Vérifications explicites
if (!CALENDAR_ID) {
  throw new Error("GOOGLE_CALENDAR_ID manquant dans le fichier .env");
}

if (!GOOGLE_CLIENT_EMAIL) {
  throw new Error("GOOGLE_CLIENT_EMAIL manquant dans le fichier .env");
}

if (!GOOGLE_PRIVATE_KEY) {
  throw new Error("GOOGLE_PRIVATE_KEY manquant dans le fichier .env");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth,
});

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
  const timeMin = new Date(`${date}T00:00:00+02:00`);
  const timeMax = new Date(`${date}T23:59:59+02:00`);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: CALENDAR_ID }],
    },
  });

  return response.data.calendars[CALENDAR_ID]?.busy || [];
}

async function getAvailableSlots(date, durationMinutes = 60) {
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

    return res.json({
      date,
      slots,
    });
  } catch (error) {
    console.error("Erreur /availability :", error);
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

    const event = await calendar.events.insert({
      calendarId: CALENDAR_ID,
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

    return res.json({
      success: true,
      eventId: event.data.id,
      htmlLink: event.data.htmlLink,
      message: "Rendez-vous réservé avec succès.",
    });
  } catch (error) {
    console.error("Erreur /book-appointment :", error);
    return res.status(500).json({
      error: "Impossible de créer le rendez-vous.",
    });
  }
});

export default router;
