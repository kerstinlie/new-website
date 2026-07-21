# Inbetween Website – Astro + Sanity + Netlify

## Setup (einmalig)

1. **Abhängigkeiten installieren** (lokal auf deinem Rechner, nicht in der Sandbox):
   ```bash
   npm install
   ```
2. **Sanity-Projekt-Daten eintragen**: `.env.example` zu `.env` kopieren und `PUBLIC_SANITY_PROJECT_ID` sowie ggf. `SANITY_API_WRITE_TOKEN` eintragen (bekommst du, sobald das Sanity-Projekt angelegt ist).
3. **Dev-Server starten**:
   ```bash
   npm run dev
   ```
   Die Website läuft dann unter `http://localhost:4321`, das eingebettete Sanity Studio unter `http://localhost:4321/studio`.

## Struktur

- `schemaTypes/` – Sanity-Schema (aktuell: `page` mit Titel, Slug, Titelbild, Rich-Text-Body, SEO-Feldern)
- `src/lib/sanity.ts` – Sanity-Client + Hilfsfunktionen (`getAllPages`, `getPageBySlug`, `urlFor`)
- `src/pages/index.astro` – Startseite, listet alle Sanity-Seiten
- `src/pages/[slug].astro` – dynamische Route, rendert eine einzelne Seite anhand ihres Slugs
- `sanity.config.ts` – Konfiguration des eingebetteten Studios

## Deployment (Netlify)

- `netlify.toml` ist bereits konfiguriert (`npm run build` → `dist/`).
- In den Netlify-Umgebungsvariablen müssen `PUBLIC_SANITY_PROJECT_ID` und `PUBLIC_SANITY_DATASET` gesetzt werden (gleiche Werte wie in `.env`).

## Migration von WordPress

Für den Content-Import aus WordPress empfiehlt sich ein eigenes Node-Skript, das:
1. die WP-Inhalte per REST-API (`/wp-json/wp/v2/pages`) oder XML-Export ausliest,
2. den HTML-Content in Portable-Text-Blöcke umwandelt (z. B. mit `@sanity/block-tools` oder `sanity-html-to-blocks`),
3. die Dokumente per `sanityClient.createOrReplace()` in Sanity anlegt.

Dieses Skript bauen wir im nächsten Schritt gemeinsam, sobald das Sanity-Projekt steht.
