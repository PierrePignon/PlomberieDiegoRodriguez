/**
 * Prerendering POST-BUILD
 * ========================
 *
 * Après `vite build`, ce script :
 *  1. Lance un serveur statique local qui sert le dossier `dist/`
 *  2. Visite chaque route avec Puppeteer (Chrome headless)
 *  3. Attend que React ait fini de rendre (incluant animations, fetchs...)
 *  4. Récupère le HTML final rendu
 *  5. L'écrit dans `dist/<route>/index.html`
 *
 * Résultat : chaque URL de ton site a sa propre page HTML statique
 * contenant déjà tout le contenu (h1, textes, meta, structured data, images, avis...).
 * Google, Bing, les previews sociaux et les crawlers IA voient immédiatement le vrai site.
 *
 * Utilisation :
 *   npm run build    # → vite build + ce script en postbuild
 *
 * Désactiver temporairement :
 *   PRERENDER_SKIP=1 npm run build
 */

import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

// Puppeteer est en dynamic import pour que les erreurs d'install soient claires
async function loadPuppeteer() {
  try {
    const mod = await import("puppeteer");
    return mod.default;
  } catch (e) {
    console.error("\n❌ Puppeteer n'est pas installé. Lance : npm install -D puppeteer\n");
    process.exit(1);
  }
}

// === Configuration ===

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 4173; // port local pour le serveur de preview
const BASE = `http://localhost:${PORT}`;

// Routes à pré-rendre. On recrée la même liste que dans App.jsx + sitemap.
// Pour ajouter une route : la lister ici, et s'assurer qu'elle est aussi dans sitemap.xml.
const STATIC_ROUTES = [
  "/",
  "/services",
  "/realisations",
  "/zones",
  "/avis",
  "/contact",
  "/rendez-vous",
  "/mentions-legales",
  "/confidentialite",
];

const CITY_SLUGS = [
  "martigues",
  "fos-sur-mer",
  "istres",
  "saint-mitre-les-remparts",
  "sausset-les-pins",
  "carry-le-rouet",
];
const CITY_ROUTES = CITY_SLUGS.map((s) => `/plombier-${s}`);

const SERVICE_SLUGS = ["debouchage", "recherche-de-fuite", "chauffe-eau"];
const SERVICE_ROUTES = SERVICE_SLUGS.map((s) => `/${s}`);

const ALL_ROUTES = [...STATIC_ROUTES, ...CITY_ROUTES, ...SERVICE_ROUTES];

// Combien de temps attendre après le load pour que React hydrate + ScrollManager tourne
const RENDER_WAIT_MS = 1500;

// Timeout maximum par page (sécurité)
const PAGE_TIMEOUT_MS = 30000;

// === Serveur statique minimaliste (pas de dépendance externe) ===

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      try {
        // Nettoie l'URL (retire query/hash)
        let urlPath = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
        if (urlPath === "/") urlPath = "/index.html";

        // Si pas d'extension → SPA fallback vers index.html (React Router prend le relais)
        if (!extname(urlPath)) urlPath = "/index.html";

        const filePath = join(DIST, urlPath);
        if (!existsSync(filePath)) {
          // Fallback SPA
          const fallback = join(DIST, "index.html");
          if (existsSync(fallback)) {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(readFileSync(fallback));
            return;
          }
          res.writeHead(404);
          res.end("Not found");
          return;
        }

        const ext = extname(filePath);
        const type = MIME[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type });
        res.end(readFileSync(filePath));
      } catch (e) {
        res.writeHead(500);
        res.end("Server error: " + e.message);
      }
    });

    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

// === Script principal ===

async function main() {
  if (process.env.PRERENDER_SKIP === "1") {
    console.log("ℹ️  Prerendering ignoré (PRERENDER_SKIP=1)");
    return;
  }

  if (!existsSync(DIST)) {
    console.error(`❌ Dossier dist/ introuvable : ${DIST}`);
    process.exit(1);
  }

  const puppeteer = await loadPuppeteer();

  console.log(`\n🌐 Prerendering de ${ALL_ROUTES.length} routes...\n`);
  const t0 = Date.now();

  // 1. Serveur statique local
  const server = await startStaticServer();
  console.log(`✓ Serveur local sur ${BASE}`);

  // 2. Browser headless
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let success = 0;
  let failed = 0;

  for (const route of ALL_ROUTES) {
    const page = await browser.newPage();
    try {
      // Bloque les requêtes externes non-essentielles pour accélérer
      // (on garde quand même les images locales + le backend API)
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const url = req.url();
        // On autorise :
        //  - les ressources locales (http://localhost:4173/...)
        //  - les images (chargées par <img>)
        //  - le backend reviews
        //  - les fonts
        const resourceType = req.resourceType();
        if (
          url.startsWith(BASE) ||
          url.includes("rodriguez-backend.fly.dev") ||
          resourceType === "image" ||
          resourceType === "font"
        ) {
          req.continue();
        } else {
          req.abort();
        }
      });

      // Capture les erreurs console pour debug (sans spammer)
      page.on("pageerror", (err) => {
        console.log(`   ⚠️  JS error sur ${route}: ${err.message.slice(0, 100)}`);
      });

      await page.goto(`${BASE}${route}`, {
        waitUntil: "networkidle2",
        timeout: PAGE_TIMEOUT_MS,
      });

      // Attendre un peu que React hydrate et que les fetchs asynchrones (useGoogleReviews) finissent
      await new Promise((r) => setTimeout(r, RENDER_WAIT_MS));

      // Récupère le HTML final
      let html = await page.content();

      // Petite normalisation : si on a des scripts injectés dynamiquement par Vite dev,
      // on les laisse (pas en dev ici, mais au cas où)

      // Écrit dans dist/<route>/index.html
      const outDir = route === "/" ? DIST : join(DIST, route.replace(/^\//, ""));
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, "index.html"), html);

      success++;
      console.log(`✓ ${route.padEnd(42)} (${(html.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      failed++;
      console.log(`✗ ${route.padEnd(42)} — ${e.message.slice(0, 60)}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  const t1 = Date.now();
  console.log(
    `\n🎉 Prerendering terminé : ${success}/${ALL_ROUTES.length} routes OK en ${((t1 - t0) / 1000).toFixed(1)}s` +
      (failed ? ` (${failed} échecs)` : "")
  );
  console.log(`   Dist : ${DIST}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("❌ Prerendering failed:", e);
  process.exit(1);
});
