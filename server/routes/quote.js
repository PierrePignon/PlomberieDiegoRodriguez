import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();

// === Multer : stockage en mémoire (les fichiers ne touchent pas le disque) ===
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB par fichier
    files: 5,
  },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    if (ok.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Format d'image non supporté (JPEG, PNG, WebP uniquement)."));
  },
});

// === Nodemailer : lazy init (comme calendar.js) ===
let _transporter = null;
let _transporterError = null;

function getTransporter() {
  if (_transporter) return _transporter;
  if (_transporterError) throw _transporterError;

  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  const missing = [];
  if (!SMTP_USER) missing.push("SMTP_USER");
  if (!SMTP_PASS) missing.push("SMTP_PASS");

  if (missing.length > 0) {
    const err = new Error(
      `Variables d'environnement manquantes : ${missing.join(", ")}.`
    );
    err.code = "MISSING_SECRETS";
    _transporterError = err;
    throw err;
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS, // Doit être un App Password Gmail (pas le mdp du compte)
    },
  });

  return _transporter;
}

// === Route principale ===
router.post(
  "/quote-request",
  upload.fields([
    { name: "photoLarge", maxCount: 1 },
    { name: "photoMedium", maxCount: 1 },
    { name: "photoClose", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, phone, email, address, service, message } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          error: "Nom et téléphone requis.",
        });
      }

      const transporter = getTransporter();

      const NOTIF_EMAIL = process.env.NOTIF_EMAIL || process.env.SMTP_USER;

      // Préparer les pièces jointes depuis les uploads
      const attachments = [];
      const photoLabels = {
        photoLarge: "1-vue-large",
        photoMedium: "2-vue-intermediaire",
        photoClose: "3-vue-precise",
      };

      for (const [field, label] of Object.entries(photoLabels)) {
        const f = req.files?.[field]?.[0];
        if (f) {
          const ext = f.mimetype.split("/")[1] || "jpg";
          attachments.push({
            filename: `${label}.${ext}`,
            content: f.buffer,
            contentType: f.mimetype,
          });
        }
      }

      const photoStatus = (field) =>
        req.files?.[field]?.[0] ? "✅ Fournie" : "❌ Non fournie";

      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0f172a;">
          <div style="background: #f97316; color: white; padding: 16px 20px; border-radius: 12px 12px 0 0; font-weight: 700; font-size: 18px;">
            📋 Nouvelle demande de devis
          </div>
          <div style="background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 20px;">

            <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px;">👤 Coordonnées client</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr><td style="padding: 6px 0; color: #64748b; width: 110px;">Nom</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;">Téléphone</td><td style="padding: 6px 0; font-weight: 600;"><a href="tel:${escapeHtml(phone)}" style="color: #f97316; text-decoration: none;">${escapeHtml(phone)}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;">Email</td><td style="padding: 6px 0;">${escapeHtml(email || "Non renseigné")}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;">Adresse</td><td style="padding: 6px 0;">${escapeHtml(address || "Non renseignée")}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;">Prestation</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(service || "Non précisée")}</td></tr>
            </table>

            <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px;">💬 Description du besoin</h3>
            <div style="background: #f8fafc; border-left: 3px solid #f97316; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; white-space: pre-wrap;">
              ${escapeHtml(message || "Pas de message")}
            </div>

            <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px;">📸 Photos (en pièces jointes)</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0;">📷 Vue large (pièce entière)</td><td style="padding: 6px 0; text-align: right;">${photoStatus("photoLarge")}</td></tr>
              <tr><td style="padding: 6px 0;">🔍 Vue intermédiaire (zone du problème)</td><td style="padding: 6px 0; text-align: right;">${photoStatus("photoMedium")}</td></tr>
              <tr><td style="padding: 6px 0;">🎯 Vue précise (gros plan)</td><td style="padding: 6px 0; text-align: right;">${photoStatus("photoClose")}</td></tr>
            </table>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; text-align: center;">
              Reçu via plomberie-diego-rodriguez.fr · ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"Devis — Site Plomberie Rodriguez" <${process.env.SMTP_USER}>`,
        to: NOTIF_EMAIL,
        replyTo: email || undefined,
        subject: `📋 Nouvelle demande de devis — ${name}${service ? ` (${service})` : ""}`,
        html,
        attachments,
      });

      console.log(
        `[quote-request] ✅ Devis envoyé — ${name} (${phone}) | ` +
        `photos: ${attachments.length}/3 | service: ${service || "n/a"}`
      );

      return res.json({
        success: true,
        message: "Demande envoyée avec succès.",
      });
    } catch (error) {
      console.error("Erreur /quote-request :", error);

      if (error.code === "MISSING_SECRETS") {
        return res.status(503).json({
          error:
            "Service de devis temporairement indisponible. Contactez Diego par téléphone : 06 37 75 92 06.",
        });
      }

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "Une des photos dépasse 10 MB. Réessayez avec des photos plus légères.",
        });
      }

      return res.status(500).json({
        error: "Impossible d'envoyer la demande. Réessayez ou appelez directement le 06 37 75 92 06.",
      });
    }
  }
);

// Mini helper anti-injection HTML pour les emails
function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default router;
