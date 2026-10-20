import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 


export const isIframe = window.self !== window.top;

/**
 * Convertit un titre en slug URL-safe pour les ancres.
 * Ex : "Rénovation totale d'une salle de bain" → "renovation-totale-d-une-salle-de-bain"
 */
export function slug(text) {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Retourne la meilleure URL pour un service en interne.
 * Si une page dédiée SEO existe pour ce service → on la privilégie (meilleur ranking).
 * Sinon → fallback sur l'ancre de la page /services.
 *
 * Mapping à maintenir en cohérence avec ServicePage.jsx > SERVICE_PAGES.
 */
const SERVICE_PAGE_SLUGS = {
  debouchage: "/debouchage",
  fuite: "/recherche-de-fuite",
  "chauffe-eau": "/chauffe-eau",
};

export function serviceUrl(serviceId) {
  if (!serviceId) return "/services";
  if (SERVICE_PAGE_SLUGS[serviceId]) return SERVICE_PAGE_SLUGS[serviceId];
  return `/services#${serviceId}`;
}

/**
 * Détermine la ville d'une réalisation ou d'un avis.
 * Retourne un lien vers la page ville dédiée si elle existe, sinon null.
 */
export function cityPageUrl(city, zones) {
  if (!city || !zones) return null;
  const normalized = city
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  const zone = zones.find(
    (z) =>
      z.hasPage &&
      z.name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase() === normalized
  );
  return zone ? `/plombier-${zone.slug}` : null;
}

/**
 * Devine le "service" d'une réalisation à partir de son champ `type`.
 * Utilisé pour linker vers la bonne page service depuis une card de réalisation.
 */
export function serviceFromRealisationType(type) {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes("fuite") || t.includes("recherche")) return "fuite";
  if (t.includes("débouch") || t.includes("debouch")) return "debouchage";
  if (t.includes("chauffe") || t.includes("cumulus")) return "chauffe-eau";
  if (t.includes("carrelage") || t.includes("faïence") || t.includes("faience")) return "carrelage";
  if (t.includes("sanitaire") || t.includes("installation") || t.includes("douche") || t.includes("wc"))
    return "sanitaire";
  if (t.includes("rénovation") || t.includes("renovation")) return "renovation";
  return null;
}

