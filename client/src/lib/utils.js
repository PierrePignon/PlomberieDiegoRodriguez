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

