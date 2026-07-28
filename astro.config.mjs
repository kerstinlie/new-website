import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

// astro.config.mjs läuft in einem reinen Node-Kontext (nicht über Vite verarbeitet),
// daher liest process.env.X hier NICHT automatisch aus der .env-Datei. loadEnv()
// laedt die .env-Datei explizit, damit die Sanity-Integration projectId/dataset bekommt.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

export default defineConfig({
  integrations: [
    react(),
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      // useCdn: false während der Migration/Entwicklung, damit du immer die
      // frischesten Inhalte siehst (kein CDN-Caching). Für den Produktions-Build
      // kannst du auf true umstellen, sobald der Content stabil ist.
      useCdn: false,
      apiVersion: '2025-01-01',
      // Bindet das Sanity Studio unter /studio in dieselbe Astro-App ein.
      studioBasePath: '/studio',
    }),
  ],
});
