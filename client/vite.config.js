import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import Sitemap from 'vite-plugin-sitemap' 

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
        // Si tu as d'autres pages, rajoute les ici, ex: ['/contact', '/devis']
        dynamicRoutes: ['/'], 
      }),
    ]
  };
});