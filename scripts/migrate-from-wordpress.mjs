// Migriert die von Claude aus dem WordPress-Export aufbereiteten Seiten/Beitraege
// (scripts/wp-migration-data.json) nach Sanity: laedt referenzierte Bilder hoch
// und legt die Dokumente an.
//
// Ausfuehren mit (Node 20.6+, liest .env automatisch):
//   node --env-file=.env scripts/migrate-from-wordpress.mjs
//
// Optionale Flags:
//   --dry-run        nichts schreiben, nur zaehlen/pruefen
//   --limit=10        nur die ersten N Dokumente verarbeiten (zum Testen)
//   --skip-images     Bilder ueberspringen (schneller zum Testen des Textes)

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SKIP_IMAGES = args.includes('--skip-images');
const limitArg = args.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Fehler: PUBLIC_SANITY_PROJECT_ID oder SANITY_API_WRITE_TOKEN fehlen.');
  console.error('Bitte sicherstellen, dass .env vorhanden ist und mit --env-file geladen wird.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

const DATA_PATH = path.join(__dirname, 'wp-migration-data.json');
const CACHE_PATH = path.join(__dirname, '.image-cache.json');

function loadImageCache() {
  if (fs.existsSync(CACHE_PATH)) {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  }
  return {};
}

function saveImageCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

const imageCache = loadImageCache();

async function uploadImage(url) {
  if (!url) return null;
  if (imageCache[url]) return imageCache[url];
  if (SKIP_IMAGES || DRY_RUN) return null;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! Bild nicht erreichbar (${res.status}): ${url}`);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = decodeURIComponent(url.split('/').pop().split('?')[0]) || 'image';
    const asset = await client.assets.upload('image', buffer, { filename });
    imageCache[url] = asset._id;
    saveImageCache(imageCache);
    return asset._id;
  } catch (err) {
    console.warn(`  ! Fehler beim Hochladen von ${url}: ${err.message}`);
    return null;
  }
}

async function resolveBody(blocks) {
  const resolved = [];
  for (const block of blocks) {
    if (block._type === 'externalImage') {
      const assetId = await uploadImage(block.url);
      if (assetId) {
        resolved.push({
          _type: 'image',
          _key: block._key,
          asset: { _type: 'reference', _ref: assetId },
        });
      }
      // wenn Upload fehlschlaegt, Block einfach auslassen statt Fehler zu werfen
    } else if (block._type === 'columns') {
      // Spalten enthalten selbst wieder Bloecke (inkl. moeglicher externalImage-
      // Platzhalter) -> rekursiv aufloesen.
      const resolvedColumns = [];
      for (const col of block.columns || []) {
        resolvedColumns.push({
          ...col,
          blocks: await resolveBody(col.blocks || []),
        });
      }
      resolved.push({ ...block, columns: resolvedColumns });
    } else if (block._type === 'processSteps') {
      // Jeder Schritt kann ein eigenes Bild (externalImage-Platzhalter) haben
      // -> ebenfalls hochladen und in eine echte Sanity-Bildreferenz aufloesen.
      const resolvedSteps = [];
      for (const step of block.steps || []) {
        const resolvedStep = { ...step };
        if (step.image && step.image._type === 'externalImage') {
          const assetId = await uploadImage(step.image.url);
          if (assetId) {
            resolvedStep.image = {
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId },
            };
          } else {
            delete resolvedStep.image;
          }
        }
        resolvedSteps.push(resolvedStep);
      }
      resolved.push({ ...block, steps: resolvedSteps });
    } else if (block._type === 'heroSlides') {
      const resolvedSlides = [];
      for (const slide of block.slides || []) {
        const resolvedSlide = { ...slide };
        if (slide.image && slide.image._type === 'externalImage') {
          const assetId = await uploadImage(slide.image.url);
          if (assetId) {
            resolvedSlide.image = {
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId },
            };
          } else {
            delete resolvedSlide.image;
          }
        }
        resolvedSlides.push(resolvedSlide);
      }
      resolved.push({ ...block, slides: resolvedSlides });
    } else if (block._type === 'quoteCarousel') {
      const resolvedItems = [];
      for (const item of block.items || []) {
        const resolvedItem = { ...item };
        if (item.image && item.image._type === 'externalImage') {
          const assetId = await uploadImage(item.image.url);
          if (assetId) {
            resolvedItem.image = {
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId },
            };
          } else {
            delete resolvedItem.image;
          }
        }
        resolvedItems.push(resolvedItem);
      }
      resolved.push({ ...block, items: resolvedItems });
    } else {
      resolved.push(block);
    }
  }
  return resolved;
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function migrateDocument(doc, index, total) {
  const docType = doc.sourceType === 'post' ? 'post' : 'page';
  const slug = slugify(doc.slug);
  const docId = `wp-${docType}-${slug}`;

  console.log(`[${index + 1}/${total}] ${docType}: ${doc.title} (${slug})`);

  if (DRY_RUN) return;

  let heroAssetId = null;
  if (doc.heroImageUrl) {
    heroAssetId = await uploadImage(doc.heroImageUrl);
  }

  const body = await resolveBody(doc.body || []);

  const sanityDoc = {
    _id: docId,
    _type: docType,
    title: doc.title,
    slug: { _type: 'slug', current: slug },
    body,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt.replace(' ', 'T') + 'Z').toISOString() : undefined,
    seo: {
      metaTitle: doc.seo?.metaTitle || undefined,
      metaDescription: doc.seo?.metaDescription || undefined,
      noIndex: !!doc.seo?.noIndex,
    },
  };

  if (docType === 'page' && heroAssetId) {
    sanityDoc.heroImage = { _type: 'image', asset: { _type: 'reference', _ref: heroAssetId } };
  }
  if (docType === 'post') {
    if (heroAssetId) {
      sanityDoc.mainImage = { _type: 'image', asset: { _type: 'reference', _ref: heroAssetId } };
    }
    sanityDoc.author = doc.author || undefined;
    sanityDoc.categories = doc.categories || undefined;
  }

  try {
    await client.createOrReplace(sanityDoc);
  } catch (err) {
    console.error(`  ! Fehler beim Anlegen von ${docId}: ${err.message}`);
  }
}

async function main() {
  const documents = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const slice = documents.slice(0, LIMIT);

  console.log(`Migriere ${slice.length} von ${documents.length} Dokumenten`);
  console.log(`Projekt: ${projectId} | Dataset: ${dataset}`);
  if (DRY_RUN) console.log('--- DRY RUN: es wird nichts geschrieben ---');
  if (SKIP_IMAGES) console.log('--- Bilder werden uebersprungen ---');
  console.log('');

  let i = 0;
  for (const doc of slice) {
    await migrateDocument(doc, i, slice.length);
    i++;
  }

  console.log('');
  console.log('Fertig.');
}

main().catch((err) => {
  console.error('Unerwarteter Fehler:', err);
  process.exit(1);
});
