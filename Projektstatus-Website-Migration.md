# Projektstatus: WordPress → Sanity + Astro + Netlify

Stand: 30.07.2026

## Ziel

Migration von inbetween.com (WordPress/Elementor) auf einen Headless-Stack: Sanity (Content), Astro (Frontend), Netlify (Hosting). Repo: `github.com/kerstinlie/new-website`, Live: `inbetween-website.netlify.app`.

## Was bisher gemacht wurde

### Infrastruktur
- Astro-Projekt aufgesetzt, mit Sanity- und Netlify-Connector verbunden
- Sanity-Projekt inkl. Dataset und Schema angelegt
- Netlify-Deployment eingerichtet (Git-verknüpft, automatischer Build bei jedem Push)

### Content-Migration
- WordPress-Export (WXR-XML) analysiert und einen Python-Konverter gebaut, der Elementor-Inhalte in Sanity-Dokumente umwandelt
- 86 Seiten und 139 Blog-Beiträge migriert (225 Dokumente gesamt)
- Sanity-Schema um mehrere Block-Typen erweitert, um Elementor-Layouts abzubilden: Spalten, Icon-Grids, Prozess-Schritte, Video-Einbettung, Hero-Slider
- Mehrere Bugs in der Extraktion gefunden und behoben, durch die Inhalte stillschweigend verloren gingen: HTML-Widgets, Slides-Widget, Timeline-Widget, Counter-Widget (falsches Feld gelesen), Flip-Box-Bilder (Foto-Feld wurde nicht erkannt)
- Success Stories, News und Webinare als kategoriegefilterte Seiten nachgebaut (ursprünglich dynamische WordPress-Widgets, die nicht automatisch migrierbar waren)

### Design/UI (Startseite, EN + DE)
- Header, Footer und Branding (Farben, Roboto-Schriftart) aus der Originalseite übernommen
- Eigens gebauter Hero-Bereich mit rotierendem Bild-Slider und Text-Overlays je Folie
- Kartenlayouts vereinheitlicht: Format-Icons, ROI-Kacheln, Erfolgsgeschichten-Karten, News-Vorschau
- Diverse Layout-Bugs behoben (Spalten stapelten sich statt nebeneinander zu stehen, uneinheitliche Kartengrößen, falsche Schriftfarbe bei Zwischenüberschriften)
- Zeilenabstände global gestrafft

### Sonstiges
- Ein wiederkehrendes Netlify-Problem diagnostiziert: Build startet manchmal, bevor die Sanity-Migration fertig geschrieben hat → Lösung: nach Migration ggf. manuell neu deployen

## Aktueller Stand

- Die **Startseite** (Home/Startseite) ist der am weitesten ausgearbeitete Bereich und wurde iterativ gegen die Original-WordPress-Seite abgeglichen
- Die **übrigen ~84 Seiten** laufen über eine generische Darstellung (gleiches Design-System, aber nicht Seite für Seite pixelgenau abgeglichen)
- **Offen/unbestätigt:** der letzte Fix-Satz (Flip-Box-Bilder für die Erfolgsgeschichten-Karten, neues Karten-Layout ohne Rahmen, "Read more"-Button bei News) wurde vorbereitet, aber die Migration + der Git-Push dafür sind noch nicht bestätigt durchgelaufen

## Nächste Schritte

1. **Sofort:** Migration ausführen (`node --env-file=.env scripts/migrate-from-wordpress.mjs`) und Code pushen (`git add -A && git commit && git push`) für die zuletzt gemachten Fixes
2. Ergebnis auf der Live-Seite verifizieren (Home + Startseite/DE)
3. Strategie-Entscheidung: welche weiteren Hauptseiten bekommen eine vertiefte Design-Politur wie die Startseite, und welche bleiben bei der generischen Darstellung (Empfehlung: 3–5 wichtigste Seiten priorisieren statt alle 86)
4. Die 91 in `wp-migration-report.md` als "manuelle Prüfung nötig" markierten Seiten stichprobenartig durchsehen, ob dort ähnliche stille Content-Verluste vorliegen wie bei Home (z. B. Flip-Box-Bilder, Counter-Widgets)
5. Deutsche Version (Startseite) gegenprüfen, ob dieselben Fixes dort ebenfalls greifen
