import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import Sitemap from 'vite-plugin-sitemap'

// ================================================================
// Toutes les routes du site — à garder synchronisées avec :
//  - src/App.jsx (les Routes)
//  - scripts/prerender.js (ALL_ROUTES)
// Le plugin vite-plugin-sitemap génère sitemap.xml à partir de ça
// au moment du `vite build` (écrase public/sitemap.xml).
// ================================================================
const CITY_SLUGS = [
  'martigues',
  'fos-sur-mer',
  'istres',
  'saint-mitre-les-remparts',
  'sausset-les-pins',
  'carry-le-rouet',
]

const SERVICE_SLUGS = ['debouchage', 'recherche-de-fuite', 'chauffe-eau']

const ALL_ROUTES = [
  '/',
  '/services',
  '/realisations',
  '/zones',
  '/avis',
  '/contact',
  '/rendez-vous',
  '/mentions-legales',
  '/confidentialite',
  ...CITY_SLUGS.map((s) => `/plombier-${s}`),
  ...SERVICE_SLUGS.map((s) => `/${s}`),
]

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };

  return {
    logLevel: 'error',
    plugins: [
      base44({
        legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
        hmrNotifier: true,
        navigationNotifier: true,
        analyticsTracker: true,
        visualEditAgent: true
      }),
      react(),
      Sitemap({
        hostname: 'https://plomberie-diego-rodriguez.fr',
        dynamicRoutes: ALL_ROUTES,
        // Priorités par type de page
        changefreq: {
          '/': 'weekly',
          '/avis': 'weekly',
        },
        priority: {
          '/': 1.0,
          '/rendez-vous': 0.9,
          '/services': 0.9,
          '/zones': 0.9,
          '/realisations': 0.8,
          '/avis': 0.8,
          '/contact': 0.7,
          '/mentions-legales': 0.3,
          '/confidentialite': 0.3,
        },
        // Exclure la 404
        exclude: ['/404'],
        readable: true,
      }),
    ]
  };
});