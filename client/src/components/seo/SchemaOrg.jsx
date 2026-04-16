import { useEffect } from "react";
import { BUSINESS } from "../../lib/business";

export default function SchemaOrg() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Plumber",
      "@id": "https://www.plomberie-rodriguez.fr/#business",
      "name": BUSINESS.name,
      "image": "https://www.plomberie-rodriguez.fr/og-image.jpg",
      "url": "https://www.plomberie-rodriguez.fr",
      "telephone": BUSINESS.phone,
      "email": BUSINESS.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": BUSINESS.address,
        "addressLocality": BUSINESS.city,
        "postalCode": BUSINESS.zip,
        "addressRegion": BUSINESS.region,
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 43.4124742,
        "longitude": 4.9801866
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:30"
        }
      ],
      "areaServed": BUSINESS.zones.map((z) => ({
        "@type": "City",
        "name": z.name
      })),
      "priceRange": "€€",
      "sameAs": [BUSINESS.googleMapsUrl],
      "description": `Artisan plombier à Port-de-Bouc (13110). Plomberie, recherche de fuite, débouchage, rénovation salle de bain, carrelage. Devis gratuit. Intervention rapide sur Port-de-Bouc, Martigues, Fos-sur-Mer, Istres et alentours.`
    };

    const el = document.getElementById("schema-org");
    if (el) {
      el.textContent = JSON.stringify(schema);
    } else {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "schema-org";
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    }
  }, []);

  return null;
}
