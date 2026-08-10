import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Inbetween Website',

  // Fest hinterlegt statt nur ueber process.env: der gehostete Studio-Build
  // (npx sanity deploy) laeuft in einem eigenen Bundler-Kontext, der die
  // PUBLIC_SANITY_*-Variablen aus der lokalen .env NICHT sieht - ohne
  // literalen Fallback wurde projectId leer in den Studio-Build gebacken.
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'gev7dohx',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
