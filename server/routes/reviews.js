import dotenv from "dotenv";
dotenv.config();

import express from "express";

const router = express.Router();

// ID de la fiche Google Business de Diego Rodriguez (Place ID stable)
// À extraire une fois pour toutes depuis l'URL Google Maps.
// Si on veut le changer un jour, le passer en env var :
// const PLACE_ID = process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID;
const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJ09cBLJwfthIR4XoDIPlFTdc";

// Cache en mémoire — on refresh toutes les heures max
// (bien suffisant : Google autorise 100 appels/jour gratuits, on en fait ~24)
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h
let cache = { data: null, fetchedAt: 0 };

async function fetchGoogleReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    const err = new Error("GOOGLE_PLACES_API_KEY manquant");
    err.code = "MISSING_SECRETS";
    throw err;
  }

  // Places API (New) - endpoint Place Details
  // On demande explicitement : rating, userRatingCount, reviews
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=fr`;

  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Places API ${res.status}: ${body}`);
  }

  const data = await res.json();

  return {
    placeId: data.id,
    name: data.displayName?.text,
    rating: data.rating || null,
    totalReviews: data.userRatingCount || 0,
    reviews: (data.reviews || []).map((r) => ({
      author: r.authorAttribution?.displayName || "Anonyme",
      avatar: r.authorAttribution?.photoUri || null,
      rating: r.rating || 5,
      date: r.relativePublishTimeDescription || "",
      publishTime: r.publishTime || null,
      text: r.text?.text || r.originalText?.text || "",
      language: r.text?.languageCode || r.originalText?.languageCode || "fr",
    })),
  };
}

router.get("/reviews", async (req, res) => {
  try {
    const now = Date.now();
    const forceRefresh = req.query.refresh === "1";

    // Cache hit valide
    if (!forceRefresh && cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
      return res.json({
        ...cache.data,
        _cached: true,
        _ageSec: Math.round((now - cache.fetchedAt) / 1000),
      });
    }

    const data = await fetchGoogleReviews();
    cache = { data, fetchedAt: now };

    console.log(
      `[reviews] ✅ Fetched Google: ${data.totalReviews} avis, rating ${data.rating}, ${data.reviews.length} textes retournés`
    );

    return res.json({
      ...data,
      _cached: false,
      _ageSec: 0,
    });
  } catch (error) {
    console.error("Erreur /reviews :", error.message);

    if (error.code === "MISSING_SECRETS") {
      return res.status(503).json({
        error: "GOOGLE_PLACES_API_KEY non configuré sur le backend.",
      });
    }

    // Si on a du cache même vieux, le servir en degraded mode
    if (cache.data) {
      return res.json({
        ...cache.data,
        _cached: true,
        _ageSec: Math.round((Date.now() - cache.fetchedAt) / 1000),
        _degraded: true,
        _error: "fallback-cache",
      });
    }

    return res.status(500).json({
      error: "Impossible de récupérer les avis Google.",
      detail: error.message,
    });
  }
});

export default router;
