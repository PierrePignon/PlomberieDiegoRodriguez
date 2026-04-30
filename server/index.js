import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import calendarRoutes from "./routes/calendar.js";

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
  const envOk = Boolean(
    process.env.GOOGLE_CALENDAR_ID &&
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
  res.json({
    status: "ok",
    env: envOk ? "ok" : "missing-secrets",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", calendarRoutes);

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
