/**
 * Optimisation d'images — PNG/JPG → WebP + variantes responsives
 * =================================================================
 *
 * Pour chaque image dans public/images/ :
 *  - génère 3 variantes WebP : -400w.webp, -800w.webp, -1200w.webp
 *  - garde l'original comme fallback (sera remplacé plus tard par un .webp aussi)
 *  - sort les fichiers dans le MÊME dossier avec un suffixe de largeur
 *
 * Résultat typique :
 *   service-depannage.png (original, 1.2 MB)
 *   → service-depannage-400w.webp  (40 KB)   mobile
 *   → service-depannage-800w.webp  (120 KB)  tablette
 *   → service-depannage-1200w.webp (240 KB)  desktop
 *
 * Le composant ResponsiveImage utilise srcset pour servir la bonne taille.
 *
 * Utilisation :
 *   npm run optimize-images
 *
 * À relancer chaque fois qu'on ajoute/remplace une image dans public/images/.
 * Idempotent : si une variante existe déjà et que la source n'a pas changé, on skip.
 */

import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public", "images");

// Les largeurs qu'on veut servir
const WIDTHS = [400, 800, 1200];
// Qualité WebP (85 = quasi-visuellement lossless, mais 3-5x plus petit que PNG)
const WEBP_QUALITY = 85;

// Extensions à traiter
const INPUT_EXTS = [".png", ".jpg", ".jpeg"];

async function walkImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Ignore un éventuel dossier "optimized" legacy
      if (entry.name === "optimized") continue;
      files.push(...(await walkImages(full)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      // Skip les variantes déjà générées : nom qui finit par -XXXw.webp
      if (/-\d+w\.webp$/i.test(entry.name)) continue;
      if (INPUT_EXTS.includes(ext)) files.push(full);
    }
  }
  return files;
}

function variantPath(originalPath, width) {
  const dir = dirname(originalPath);
  const name = basename(originalPath, extname(originalPath));
  return join(dir, `${name}-${width}w.webp`);
}

async function needsRebuild(src, dest) {
  if (!existsSync(dest)) return true;
  const [s, d] = await Promise.all([stat(src), stat(dest)]);
  // Si l'original est plus récent, on rebuild
  return s.mtimeMs > d.mtimeMs;
}

async function processImage(src) {
  const image = sharp(src);
  const meta = await image.metadata();
  const srcWidth = meta.width || 1200;

  const results = [];
  for (const w of WIDTHS) {
    // Ne pas upscaler : si l'image source est plus petite, on garde sa taille
    const targetWidth = Math.min(w, srcWidth);
    const dest = variantPath(src, w);

    if (!(await needsRebuild(src, dest))) {
      results.push({ width: w, dest, status: "cached" });
      continue;
    }

    await sharp(src)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(dest);

    const sizeKB = Math.round((await stat(dest)).size / 1024);
    results.push({ width: w, dest, status: "built", sizeKB });
  }
  return results;
}

async function main() {
  if (!existsSync(ROOT)) {
    console.error(`❌ Dossier images introuvable : ${ROOT}`);
    process.exit(1);
  }

  console.log(`\n🖼️  Scan de ${ROOT}\n`);
  const t0 = Date.now();

  const images = await walkImages(ROOT);
  console.log(`Trouvé ${images.length} images sources à traiter.\n`);

  let totalBuilt = 0;
  let totalCached = 0;
  let totalBytesSaved = 0;

  for (const src of images) {
    const relative = src.replace(ROOT, "").replace(/\\/g, "/").replace(/^\//, "");
    try {
      const srcSize = (await stat(src)).size;
      const results = await processImage(src);

      const builtVariants = results.filter((r) => r.status === "built");
      const cachedVariants = results.filter((r) => r.status === "cached");
      totalBuilt += builtVariants.length;
      totalCached += cachedVariants.length;

      if (builtVariants.length > 0) {
        const builtSizes = builtVariants
          .map((r) => `${r.width}w=${r.sizeKB}KB`)
          .join(" ");
        // Compare largest WebP to source
        const biggest = builtVariants[builtVariants.length - 1];
        if (biggest && biggest.sizeKB) {
          const saved = srcSize - biggest.sizeKB * 1024;
          if (saved > 0) totalBytesSaved += saved;
        }
        console.log(
          `✓ ${relative.padEnd(50)} (${Math.round(srcSize / 1024)}KB → ${builtSizes})`
        );
      } else {
        console.log(`· ${relative.padEnd(50)} (déjà à jour)`);
      }
    } catch (e) {
      console.log(`✗ ${relative} — ${e.message}`);
    }
  }

  const t1 = Date.now();
  console.log(
    `\n🎉 ${totalBuilt} variantes générées, ${totalCached} en cache, en ${((t1 - t0) / 1000).toFixed(1)}s`
  );
  if (totalBytesSaved > 0) {
    console.log(`   Économie estimée (vs original) : ~${Math.round(totalBytesSaved / 1024)} KB\n`);
  }
}

main().catch((e) => {
  console.error("❌ Optimisation échouée :", e);
  process.exit(1);
});
