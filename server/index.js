import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import calendarRoutes from "./routes/calendar.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", calendarRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
