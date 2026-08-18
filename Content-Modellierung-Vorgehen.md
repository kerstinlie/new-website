# Content-Modellierung: Vorgehen, um das CI der alten Seite zu treffen

Stand: 18.08.2026

## Warum es aktuell nicht konvergiert

Wir haben bisher **Inhalte** migriert, aber nicht das **Design-System**. Elementor speichert das Aussehen an zwei Stellen:

1. **Global (der "Kit")** – Schriftgrößen, Zeilenhöhen, Farben, Containerbreiten, Abstände. Das ist das CI.
2. **Pro Widget/Sektion** – Abweichungen im Einzelfall.

Beides haben wir beim Export verworfen. Was übrig blieb, ist Text, Bild und eine grobe Spaltenstruktur. Jede optische Korrektur seitdem war deshalb eine lokale Schätzung anhand eines Screenshots — ohne gemeinsame Grundlage. Das erklärt genau die genannten Symptome:

| Symptom | Ursache |
|---|---|
| Headline-Größen passen nicht | Keine Typo-Skala übernommen, Größen sind geraten |
| Zeilenabstände falsch | `line-height` war global gesetzt, nie übertragen |
| Ausrichtung passt nicht | Elementor-Ausrichtung pro Sektion/Spalte verworfen |
| Größenverhältnisse passen nicht | Containerbreite und Abstandsskala unbekannt |
| Karussells fehlen | Widget-Typen nie modelliert (siehe unten) |

**Wichtig:** Diese Werte stehen **nicht im WordPress-Export**. Ich habe nachgesehen — der Export enthält weder einen `elementor_kit`-Eintrag noch nutzbares Custom CSS (`custom_css` ist leer). Das CI muss also aus einer anderen Quelle kommen.

## Was noch fehlt (gezählt in den 225 veröffentlichten Seiten)

| Widget | Vorkommen | Aktuell |
|---|---|---|
| flip-box | 225 | fehlt komplett |
| icon-list | 13 | wird zu Fließtext |
| media-carousel | 13 | fehlt |
| counter (Zahlen-Animation) | 12 | fehlt |
| image-carousel | 11 | fehlt |
| hotspot | 10 | fehlt |
| timeline | 7 | fehlt |
| toggle / accordion / tabs | 8 | fehlt |
| gallery / image-gallery | 4 | fehlt |

Dazu die 71 Sektionen mit Hintergrundbild und 179 Sektionen mit globalen Theme-Farben, die wir aktuell nicht auflösen können.

---

## Vorgeschlagenes Vorgehen: drei Ebenen, in dieser Reihenfolge

Der entscheidende Unterschied zum bisherigen Vorgehen: **erst das Fundament, dann die Bausteine, dann die Seiten.** Nicht mehr Seite für Seite nachjustieren.

### Ebene 1 – Design-Tokens (das CI-Fundament)

Eine einzige Datei, die alle Gestaltungswerte zentral festlegt:

- **Typo-Skala**: H1–H4, Fließtext, Kleintext — je Größe, Gewicht, Zeilenhöhe, Laufweite, Versalien ja/nein
- **Abstandsskala**: die 4–6 Werte, die für Innen- und Außenabstände erlaubt sind
- **Farben**: Rot, Sandtöne, Grautöne, Text
- **Containerbreiten** und Umbruchpunkte

Sobald das steht, ändert eine Korrektur an einer Stelle das Aussehen **aller** Seiten konsistent — statt wie bisher nur einer.

**Woher die Werte kommen — drei Möglichkeiten:**

1. **Aus dem CSS der Live-Seite** (genauester Weg). Ihr schickt mir die kompilierte Stylesheet-Datei von inbetween.com, oder ich lese die Werte im Browser aus. Damit treffen wir die Originalwerte exakt statt sie zu schätzen.
2. **Aus einem vorhandenen Styleguide/Brand Manual**, falls es eines gibt.
3. **Aus Screenshots ableiten** — geht, ist aber ungenau und der langsamste Weg.

### Ebene 2 – Baustein-Katalog

Ein fester, endlicher Satz an Abschnittstypen. Jeder entspricht einem wiederkehrenden Muster der alten Seite:

| Baustein | ersetzt im Original |
|---|---|
| Hero (Bild/Farbe/Verlauf) | Hero-Sektionen |
| Text + Bild (2-spaltig, seitenverkehrt) | Standard-Sektion |
| Feature-Grid | icon-box, image-box, flip-box |
| Prozess-Schritte | processSteps |
| Karussell (Bild/Medien/Zitat) | image-carousel, media-carousel, slides |
| Zahlen/Kennzahlen | counter |
| Akkordeon / FAQ | toggle, accordion, tabs |
| CTA-Band | farbige Abschluss-Sektionen |
| Formular-Band | form |
| Logo-Leiste | Kundenlogos |

Jeder Baustein bekommt feste Varianten (Hintergrund, Ausrichtung, Abstand) — **keine freie Gestaltung pro Seite.** Das ist der Punkt, an dem ein CMS Konsistenz erzwingt statt sie zu hoffen.

### Ebene 3 – Seitentypen

Jeder Seitentyp legt fest, welche Bausteine er in welcher Reihenfolge nutzt:

| Seitentyp | Anzahl | Aufbau |
|---|---|---|
| Produktseite | ~20 | Hero → Feature-Grid → Text+Bild → Schritte → CTA |
| Success Story | 15 | Hero-Band → Fließtext + Formular → Zitat-Karussell → Kennzahlen → Download |
| News-/Webinar-Artikel | ~90 | Titelkopf → Fließtext → CTA |
| Übersichtsseite | ~10 | Intro → gefilterte Kachelliste |
| Landing Page | wenige | frei, wie die neue Datasheet-Seite |
| Rechtstext | ~6 | schlichter Fließtext |

---

## Ablauf

1. **CI-Werte beschaffen** und als Token-Datei anlegen (Ebene 1)
2. **Eine Referenzseite je Seitentyp** sauber aufbauen und von euch abnehmen lassen
3. Erst nach Abnahme: **Ausrollen** auf alle Seiten des Typs
4. Fehlende Bausteine (Karussells, Flip-Box, Counter, Akkordeon) ergänzen und die Extraktion darauf umstellen

Der Unterschied zum bisherigen Vorgehen: Abnahme erfolgt **pro Seitentyp statt pro Seite**. Bei 226 Seiten ist das der einzige Weg, der in vertretbarer Zeit zu einem einheitlichen Ergebnis führt.

## Was ich dafür von euch brauche

- **Das CSS der Live-Seite** oder alternativ Zugriff, um die Werte auszulesen (ohne das bleibt jede Typo- und Abstandskorrektur Raterei)
- **Entscheidung**, mit welchem Seitentyp wir anfangen
- **Klärung**, ob das CI 1:1 übernommen werden soll oder ob die Migration zur Vereinheitlichung genutzt wird
