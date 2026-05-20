import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Gère le comportement du scroll lors des changements de route :
 *
 *  - Pas de hash dans l'URL    → scroll instantané en haut de page
 *  - Hash dans l'URL (#projet) → scroll fluide vers l'élément correspondant
 *                                avec un petit délai pour laisser le DOM se monter
 *
 * À monter UNE seule fois au niveau du Router. Ne rend rien.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");

      // Plusieurs tentatives pour laisser le temps aux composants de monter
      // (animations, lazy load, etc.)
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          // Offset pour ne pas masquer le titre derrière la navbar (~80px)
          const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        } else if (attempts < 20) {
          // Réessaie toutes les 50 ms jusqu'à 1 sec
          setTimeout(() => tryScroll(attempts + 1), 50);
        }
      };

      tryScroll();
    } else {
      // Pas de hash → on remonte en haut, instantanément (UX immédiate)
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}
