import { useEffect } from "react";

/**
 * Met à jour les balises SEO de la page courante (title, meta description, canonical, OG).
 * À appeler dans chaque page React qui a besoin de balises SEO spécifiques.
 *
 * Usage :
 *   usePageMeta({
 *     title: "Plombier Martigues | Diego Rodriguez",
 *     description: "Plombier artisan à Martigues (13500)...",
 *     canonical: "https://plomberie-diego-rodriguez.fr/plombier-martigues",
 *     jsonLd: { "@context": "https://schema.org", ... }  // optionnel
 *   });
 */
export default function usePageMeta({ title, description, canonical, jsonLd, jsonLdId = "page-jsonld" }) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title;
    }

    // 2. Meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);

      // OG description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);
    }

    // 3. OG title
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", title);
    }

    // 4. Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute("content", canonical);
    }

    // 5. JSON-LD page-specific (Service schema par ex.)
    if (jsonLd) {
      let script = document.getElementById(jsonLdId);
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = jsonLdId;
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup : on retire le JSON-LD spécifique en quittant la page
    // (les autres balises sont écrasées par la page suivante)
    return () => {
      if (jsonLd) {
        const script = document.getElementById(jsonLdId);
        if (script) script.remove();
      }
    };
  }, [title, description, canonical, jsonLd, jsonLdId]);
}
