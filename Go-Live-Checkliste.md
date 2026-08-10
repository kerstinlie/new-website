# Go-Live-Checkliste: inbetween.com → Sanity + Astro + Netlify

Stand: 10.08.2026 · Voraussetzung: alle Inhalte sind auf der neuen Seite korrekt abgebildet

**Aktueller Bestand:** 87 Seiten, 139 Beiträge (226 Dokumente in Sanity)
**Neue Seite:** inbetween-website.netlify.app · **Studio:** inbetween-website.sanity.studio

---

## Phase 1 – Vor dem Go-Live (inhaltlich)

### 1.1 Inhaltliche Endabnahme
- [ ] Alle 226 Dokumente stichprobenartig gegen das Original prüfen (Seitentypen: Startseite, Produktseiten, Success Stories, News, Webinare, Rechtstexte)
- [ ] Die 31 in `scripts/wp-migration-report.md` markierten Seiten manuell nacharbeiten
- [ ] Bekannte Einzelfälle abarbeiten: ARTDECO (defektes Bild), Multishoring Success Story (abweichender Seitenaufbau ohne Hero-Band)
- [ ] Beide Sprachversionen (EN/DE) auf Vollständigkeit prüfen
- [ ] Mobile-Ansicht aller Haupt-Templates testen

### 1.2 Navigation
- [ ] Haupt- und Footer-Navigation in `src/data/navigation.ts` gegen die Live-Seite abgleichen
- [ ] **Alle Nav-Ziele auf neue interne Slugs umstellen** – aktuell zeigen Teile noch auf `inbetween.com` (z. B. "Start Free Trial" im Header ist hart auf `https://inbetween.com/en/start-free-trial/` verdrahtet)
- [ ] Sprachumschalter EN/DE prüfen: springt aktuell immer auf die Startseite, sollte idealerweise auf die entsprechende Übersetzung der aktuellen Seite zeigen
- [ ] Dropdown-Menüs auf Touch-Geräten testen
- [ ] Footer-Links, rechtliche Seiten (Impressum, Datenschutz) und Social-Links prüfen

### 1.3 Interne Verlinkung im Content
- [ ] **1.875 Links im Content zeigen noch auf `inbetween.com`** – diese müssen auf relative Pfade der neuen Seite umgeschrieben werden, sonst verlässt der Nutzer die neue Seite und die Linkkraft geht verloren
  - 1.597 ohne Sprachpräfix, 203 mit `/en/`, 75 mit `/de/`
- [ ] **121 PDF-Links** zeigen auf `inbetween.com/wp-content/uploads/…` (Case Studies, Datenblätter) → PDFs migrieren und Links anpassen, oder bewusst entscheiden, den alten Server dafür weiterlaufen zu lassen
- [ ] Nach der Umstellung erneut prüfen, dass keine Links ins Leere laufen

### 1.4 Formulare & Downloads
- [ ] Alle Formularvarianten real testen (Absenden, Weiterleitung, PDF-Download)
- [ ] Netlify-Forms-Benachrichtigungen an die richtigen Empfänger prüfen
- [ ] Double-Opt-in / Newsletter-Anbindung klären, falls gewünscht
- [ ] Spam-Schutz prüfen (Honeypot ist aktiv, ggf. reicht das nicht)

---

## Phase 2 – SEO-Vorbereitung (traffic-kritisch)

> Das ist der Teil, bei dem Fehler am teuersten sind. Nichts davon sollte erst nach dem Go-Live passieren.

### 2.1 URL-Mapping erstellen
Die URL-Struktur ändert sich grundlegend:

| | alt (WordPress) | neu (Astro) |
|---|---|---|
| Seiten | `inbetween.com/en/<slug>/` | `/<slug>` |
| Beiträge | `inbetween.com/en/<slug>/` | `/blog/<slug>` |
| Sprachen | `/en/…` und `/de/…` | kein Präfix |

- [ ] Vollständige Liste aller alten URLs ziehen (Screaming Frog, XML-Sitemap der alten Seite, Google Search Console → Seiten, Serverlogs)
- [ ] Jede alte URL genau einer neuen URL zuordnen (1:1-Mapping, keine Sammelweiterleitung auf die Startseite)
- [ ] Besonders auf die traffic-stärksten Seiten achten: diese zuerst mappen und doppelt prüfen
- [ ] Sonderfälle: Kategorie-/Archivseiten, Paginierung, Autorenseiten, Tag-Seiten, alte Kampagnen-URLs

### 2.2 301-Weiterleitungen einrichten
- [ ] Mapping als 301-Redirects in `netlify.toml` bzw. `_redirects` hinterlegen (aktuell ist dort **nur** die Studio-Regel, noch keine einzige SEO-Weiterleitung)
- [ ] Sprachpräfix-Regeln ergänzen (`/en/*`, `/de/*`)
- [ ] Trailing-Slash-Verhalten festlegen und konsistent halten
- [ ] Nach dem Deploy jede Weiterleitung testen (Statuscode muss 301 sein, nicht 302, und keine Ketten über mehrere Sprünge)

### 2.3 Technisches SEO ergänzen
Aktuell fehlt im `BaseLayout.astro` noch alles davon:
- [ ] `sitemap.xml` generieren (`@astrojs/sitemap`) und in der Search Console einreichen
- [ ] `robots.txt` anlegen
- [ ] Canonical-Tags auf allen Seiten
- [ ] `hreflang`-Auszeichnung für die EN/DE-Sprachpaare
- [ ] Open-Graph- und Twitter-Card-Tags (sonst brechen Social-Vorschauen)
- [ ] Strukturierte Daten (Organization, Article für Beiträge, BreadcrumbList)
- [ ] 404-Seite gestalten

### 2.4 Metadaten vervollständigen
- [ ] **52 Seiten und 68 Beiträge haben keinen Meta-Titel**, 51 Seiten und 70 Beiträge keine Meta-Description → aus der alten Seite (Rank Math) nachziehen oder neu schreiben
- [ ] H1-Struktur prüfen: pro Seite genau eine H1
- [ ] Bild-Alt-Texte prüfen (wurden bei der Migration teils nicht übernommen)

### 2.5 Baseline dokumentieren
- [ ] Aktuelle Rankings, Sichtbarkeitsindex, organischen Traffic und Top-Seiten **vor** dem Umzug festhalten – nur so lässt sich danach beurteilen, ob es Verluste gibt
- [ ] Search-Console-Daten exportieren (Klicks/Impressionen je URL, letzte 12 Monate)

---

## Phase 3 – Tracking, Recht, Performance

- [ ] Analytics/Tracking auf der neuen Seite einbinden (Google Analytics, Matomo o. ä.) – aktuell ist keines aktiv
- [ ] Cookie-Consent-Banner einbinden, falls auf der alten Seite vorhanden
- [ ] Datenschutzerklärung an neue Dienste anpassen (Netlify, Sanity, Fonts)
- [ ] Google Fonts werden aktuell von Google-Servern geladen → für DSGVO-Konformität ggf. selbst hosten
- [ ] Lighthouse-Check (Performance, Accessibility, Best Practices, SEO)
- [ ] Barrierefreiheit prüfen – relevant auch inhaltlich, da ihr selbst zum Thema BFSG publiziert
- [ ] Bildgrößen/Ladeverhalten prüfen (Lazy Loading, moderne Formate)

---

## Phase 4 – Go-Live

- [ ] Zeitpunkt mit geringem Traffic wählen (z. B. früh morgens), nicht Freitagnachmittag
- [ ] Vollständiges Backup der alten WordPress-Seite (Dateien + Datenbank) sichern und **aufbewahren**
- [ ] Alten Server nach dem Umzug nicht sofort abschalten (Rollback-Möglichkeit, PDF-Links)
- [ ] DNS auf Netlify umstellen, TTL vorher senken
- [ ] Custom Domain in Netlify hinterlegen, SSL-Zertifikat aktivieren
- [ ] `www`- vs. Nicht-`www`-Variante festlegen und die andere weiterleiten
- [ ] HTTPS erzwingen
- [ ] Suchmaschinen-Indexierung freigeben (kein `noindex` mehr auf der neuen Seite)

---

## Phase 5 – Direkt nach dem Go-Live

- [ ] Neue Property in der Google Search Console anlegen, Sitemap einreichen
- [ ] Wichtigste URLs manuell zur Indexierung einreichen
- [ ] Live-Crawl der neuen Seite (Screaming Frog) auf 404er, Redirect-Ketten, fehlende Titel
- [ ] Formulare auf der Live-Domain erneut testen
- [ ] Externe Dienste auf die neue URL umstellen: Google Business, LinkedIn, Newsletter-Vorlagen, Signaturen, Partner-Verzeichnisse, Akeneo-Marketplace-Eintrag
- [ ] Backlink-Geber mit den wichtigsten Verweisen ggf. um Aktualisierung bitten

## Phase 6 – Monitoring (erste 4–8 Wochen)

- [ ] Search Console täglich auf Crawling-Fehler und 404er prüfen
- [ ] Indexierungsstatus beobachten: werden die neuen URLs aufgenommen, fallen die alten raus?
- [ ] Rankings und organischen Traffic gegen die Baseline aus 2.5 vergleichen
- [ ] Ein temporärer Rückgang von 10–20 % in den ersten Wochen ist normal; hält er länger als 6–8 Wochen an oder ist deutlich stärker, gezielt nach fehlenden Weiterleitungen suchen
- [ ] 404-Logs regelmäßig auswerten und fehlende Weiterleitungen nachtragen

---

## Offene technische Punkte aus dem Projekt

- [ ] **Netlify-Build-Hook + Sanity-Webhook einrichten**, damit Inhaltsänderungen im Studio automatisch einen Deploy auslösen (aktuell manueller Klick auf "Trigger deploy" nötig)
- [ ] Redaktionelle Einweisung ins Sanity Studio für das Team
- [ ] Zuständigkeiten und Freigabeprozess für Inhaltsänderungen festlegen
