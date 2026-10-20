import { useEffect, useState } from "react";

const BACKEND_URL = "https://rodriguez-backend.fly.dev";

// Cache simple en mémoire pour éviter plusieurs fetchs pendant une même navigation
let _promise = null;
let _data = null;

/**
 * Hook qui fetch les avis Google LIVE depuis notre backend Fly.
 *
 * Backend endpoint : GET /api/reviews
 * Retourne : { rating, totalReviews, reviews: [5 derniers], _cached, _ageSec }
 *
 * Fallback gracieux : si le backend est down ou si la clé API manque,
 * on retourne les valeurs par défaut depuis BUSINESS (reviews statiques).
 *
 * Props optionnelles :
 *   fallback : { rating, reviewCount, reviews } → valeurs à afficher si l'API fail
 */
export default function useGoogleReviews(fallback = {}) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    rating: fallback.rating ?? null,
    totalReviews: fallback.reviewCount ?? null,
    reviews: fallback.reviews ?? [],
    isLive: false, // true si on affiche des données fraîches de Google
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Déduplication : si une requête est déjà en cours, on la réutilise
        if (!_promise && !_data) {
          _promise = fetch(`${BACKEND_URL}/api/reviews`, {
            method: "GET",
            headers: { Accept: "application/json" },
          }).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          });
        }

        const data = _data || (await _promise);
        _data = data;
        _promise = null;

        if (cancelled) return;

        setState({
          loading: false,
          error: null,
          rating: data.rating || fallback.rating || null,
          totalReviews: data.totalReviews || fallback.reviewCount || null,
          reviews: data.reviews || [],
          isLive: true,
        });
      } catch (err) {
        _promise = null;
        if (cancelled) return;
        // Fallback silencieux sur les valeurs statiques
        setState({
          loading: false,
          error: err.message,
          rating: fallback.rating ?? null,
          totalReviews: fallback.reviewCount ?? null,
          reviews: fallback.reviews ?? [],
          isLive: false,
        });
      }
    };

    load();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
