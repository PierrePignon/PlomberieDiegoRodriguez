import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import calendarRoutes from "./routes/calendar.js";
import quoteRoutes from "./routes/quote.js";

const app = express();

app.use(cors({
  origin: [
    "https://plomberiediegorodriguez.pages.dev",
    "https://plomberie-diego-rodriguez.fr",
    "https://www.plomberie-diego-rodriguez.fr",
    "http://localhost:5173",
    "http://localhost:3000"
  ]
}));

app.use(express.json());

// Healthcheck endpoint (Fly + monitoring externe)
app.get("/healthz", (req, res) => {
  const calendarOk = Boolean(
    process.env.GOOGLE_CALENDAR_ID &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
  const smtpOk = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  res.json({
    status: "ok",
    services: {
      calendar: calendarOk ? "ok" : "missing-secrets",
      smtp: smtpOk ? "ok" : "missing-secrets",
    },
    config: {
      // Permet de vérifier d'un coup d'œil où partent les notifications + RDV
      notif_target: process.env.NOTIF_EMAIL || process.env.SMTP_USER || "(non défini)",
      smtp_sender: process.env.SMTP_USER || "(non défini)",
      calendar_target: process.env.GOOGLE_CALENDAR_ID || "(non défini)",
      service_account: process.env.GOOGLE_CLIENT_EMAIL || "(non défini)",
    },
    timestamp: new Date().toISOString()
  });
});

// Endpoint de test d'envoi d'email — pratique pour debug sans remplir le formulaire
app.get("/api/test-email", async (req, res) => {
  try {
    const nodemailer = (await import("nodemailer")).default;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const NOTIF_EMAIL = process.env.NOTIF_EMAIL || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      return res.status(503).json({ error: "SMTP non configuré." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const ts = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    const info = await transporter.sendMail({
      from: `"Devis — Site Plomberie Rodriguez (TEST)" <${SMTP_USER}>`,
      to: NOTIF_EMAIL,
      subject: `🧪 Test d'envoi — ${ts}`,
      text: `Ceci est un email de test envoyé depuis le backend Fly à ${ts}.\n\nDestinataire configuré : ${NOTIF_EMAIL}\nExpéditeur : ${SMTP_USER}\n\nSi vous voyez ce message, le pipeline fonctionne.`,
    });

    console.log(`[test-email] ✅ Test envoyé à ${NOTIF_EMAIL} | messageId=${info.messageId}`);

    res.json({
      success: true,
      sent_to: NOTIF_EMAIL,
      sent_from: SMTP_USER,
      messageId: info.messageId,
      response: info.response,
      timestamp: ts,
    });
  } catch (error) {
    console.error("Erreur /api/test-email :", error);
    res.status(500).json({
      error: error.message,
      code: error.code,
    });
  }
});

app.use("/api", calendarRoutes);
app.use("/api", quoteRoutes);

// Error handler global (filet de sécurité)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Erreur interne du serveur." });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Healthcheck: GET /healthz`);
});
