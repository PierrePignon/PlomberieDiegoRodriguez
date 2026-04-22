import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import calendarRoutes from "./routes/calendar.js";

const app = express();

app.use(cors({
  origin: [
    "https://plomberiediegorodriguez.pages.dev",
    "https://www.plomberie-diego-rodriguez.fr"
  ]
}));

app.use(express.json());

app.use("/api", calendarRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});