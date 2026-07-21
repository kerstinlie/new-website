import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

export default defineConfig({
  integrations: [
    react(),
    sanity({
      projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
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
