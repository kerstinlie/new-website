import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../lib/sanity';

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// Manche Elementor-Quellseiten haben den gleichen Titel doppelt hinterlegt
// (z.B. einmal als "Heading"-Widget, einmal nochmal im Icon-Box-Titel). Beim
// Rendern werden direkt aufeinanderfolgende Bloecke mit identischem Text
// zusammengefasst, damit keine sichtbaren Dopplungen entstehen.
function blockText(block: any): string {
  if (block?._type !== 'block') return '';
  return (block.children || []).map((c: any) => c.text || '').join('').trim();
}

function dedupeConsecutiveBlocks(blocks: any[]): any[] {
  const out: any[] = [];
  for (const b of blocks || []) {
    const prev = out[out.length - 1];
    if (prev && b._type === 'block' && prev._type === 'block' && blockText(b) && blockText(b) === blockText(prev)) {
      continue; // Duplikat ueberspringen
    }
    out.push(b);
  }
  return out;
}

// Manche Abschnitte (z.B. "Highlights", "A ROi you can count on") bestehen aus
// kurzen, komplett fett formatierten Bloecken gefolgt von einem Beschreibungs-
// text - im Original sind das eigentlich Mini-Ueberschriften, kommen aus dem
// WordPress-Export aber nur als normaler, fett markierter Absatz. Diese werden
// erkannt und optisch als kleine Zwischenueberschrift statt als Flie&#223;text
// dargestellt, damit lange Textbloecke besser lesbar sind.
function isBoldOnlyBlock(block: any): boolean {
  if (block?._type !== 'block' || block.style !== 'normal') return false;
  const children = block.children || [];
  if (!children.length) return false;
  const allBold = children.every((c: any) => (c.marks || []).includes('strong'));
  const text = blockText(block);
  return allBold && text.length > 0 && text.length < 90;
}

// Elementor-Logo-/Bild-Karussells (z.B. "285+ happy customers worldwide")
// werden im WordPress-Export nur als lose Folge einzelner Bild-Widgets
// exportiert, ohne Hinweis auf das rotierende Karussell-Layout. Drei oder
// mehr direkt aufeinanderfolgende Bild-Bloecke auf oberster Ebene werden
// deshalb zu einer automatisch scrollenden Logo-Leiste zusammengefasst,
// statt sie einzeln und riesig untereinander darzustellen.
function groupImageStrips(blocks: any[]): any[] {
  const out: any[] = [];
  const arr = blocks || [];
  let i = 0;
  while (i < arr.length) {
    const b = arr[i];
    if (b?._type === 'image' && b?.asset) {
      const group = [b];
      let j = i + 1;
      while (arr[j]?._type === 'image' && arr[j]?.asset) {
        group.push(arr[j]);
        j++;
      }
      if (group.length >= 3) {
        out.push({ _type: 'imageStrip', _key: b._key, images: group });
      } else {
        out.push(...group);
      }
      i = j;
    } else {
      out.push(b);
      i++;
    }
  }
  return out;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <img
          src={urlFor(value).width(1000).url()}
          alt={value.alt || ''}
          style={{ borderRadius: '8px', margin: '1.5rem 0' }}
        />
      );
    },
    columns: ({ value }) => {
      const cols = value?.columns || [];
      if (!cols.length) return null;
      // Elementor-Counter-Widgets (animierte Zahlen wie "2.450") kommen aus dem
      // WordPress-Export nur als nackte Ziffern ohne Label/Animation an - das
      // sieht ohne Kontext kaputt aus, daher werden reine Zahlen-Spalten
      // ausgeblendet statt sie bedeutungslos anzuzeigen.
      const allNumeric = cols.every((col: any) => {
        const text = (col.blocks || []).map((b: any) => blockText(b)).join('').trim();
        return text.length > 0 && /^[\d.,]+$/.test(text);
      });
      if (allNumeric) return null;
      // Bei 3 oder mehr schmalen Spalten in einer Reihe sieht es optisch besser
      // aus, sie als Karten-Grid darzustellen (z.B. Format-Icons, ROI-Kacheln).
      const isGrid = cols.length >= 3;
      // CSS Grid statt Flexbox: bei Flex mit Prozent-Breiten kann ein grosses
      // Bild in einer Spalte die andere Spalte trotz "min-width: 0" in eine
      // neue Zeile zwingen (Flexbox-Mindestgroessen-Eigenheit). Grid-Spalten
      // sind exakt definiert und verhalten sich dadurch vorhersehbar.
      const gridTemplateColumns = !isGrid
        ? cols.map((c: any) => (c.width ? `${c.width}%` : '1fr')).join(' ')
        : undefined;
      return (
        <div
          className={isGrid ? 'pt-columns pt-columns--grid' : 'pt-columns'}
          style={gridTemplateColumns ? { gridTemplateColumns } : undefined}
        >
          {cols.map((col: any) => {
            // Manche Original-Widgets (z.B. die Erfolgsgeschichten-Kacheln
            // "Arkema"/"Festool"/"Vitakraft") hatten im WordPress-Export gar
            // kein echtes Bild hinterlegt - nur Ueberschrift, Text und Link.
            // Damit diese Karten trotzdem nicht "leer" wirken, bekommen sie
            // statt eines fehlenden Fotos ein Monogramm aus dem Anfangs-
            // buchstaben der Karten-Ueberschrift.
            const hasImage = (col.blocks || []).some((b: any) => b._type === 'image');
            const headingBlock = (col.blocks || []).find((b: any) => b._type === 'block');
            const headingText = isGrid && !hasImage ? blockText(headingBlock) : '';
            return (
              <div key={col._key} className={isGrid ? 'pt-column pt-column--card' : 'pt-column'}>
                {headingText && (
                  <div className="pt-column__monogram" aria-hidden="true">
                    {headingText.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <PortableText value={groupImageStrips(dedupeConsecutiveBlocks(col.blocks))} components={components} />
              </div>
            );
          })}
        </div>
      );
    },
    iconBoxGrid: ({ value }) => {
      const items = value?.items || [];
      if (!items.length) return null;
      return (
        <div className="pt-icon-grid">
          {items.map((item: any) => (
            <div key={item._key} className="pt-icon-box">
              {item.title && <h3>{item.title}</h3>}
              {item.text && <p>{item.text}</p>}
            </div>
          ))}
        </div>
      );
    },
    processSteps: ({ value }) => {
      const steps = value?.steps || [];
      if (!steps.length) return null;
      return (
        <div className="pt-steps">
          {steps.map((step: any) => (
            <div key={step._key} className="pt-step">
              <div className="pt-step__label">{step.label}</div>
              {step.image && (
                <img src={urlFor(step.image).width(500).url()} alt={step.title || ''} />
              )}
              {step.title && <h3>{step.title}</h3>}
              {step.text && <p>{step.text}</p>}
            </div>
          ))}
        </div>
      );
    },
    // Elementor-Slides-Widgets, die NICHT der Haupt-Hero oben auf der Seite
    // sind (z.B. ein zweites Slides-Widget weiter unten im Content), werden
    // hier als einfaches statisches Karten-Grid dargestellt, statt einen
    // "Unknown block type"-Fehler zu zeigen.
    heroSlides: ({ value }) => {
      const slides = value?.slides || [];
      if (!slides.length) return null;
      return (
        <div className="pt-slides">
          {slides.map((slide: any) => (
            <div key={slide._key} className="pt-slide-card">
              {slide.image?.asset && (
                <img src={urlFor(slide.image).width(600).url()} alt={slide.heading || ''} />
              )}
              {slide.heading && <h3>{slide.heading}</h3>}
              {slide.description && <p>{slide.description}</p>}
              {slide.buttonText && (
                <a
                  href={slide.buttonHref || '#'}
                  target={/^https?:\/\//.test(slide.buttonHref || '') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {slide.buttonText}
                </a>
              )}
            </div>
          ))}
        </div>
      );
    },
    imageStrip: ({ value }) => {
      const images = value?.images || [];
      if (!images.length) return null;
      const loop = [...images, ...images];
      return (
        <div className="pt-logo-strip">
          <div className="pt-logo-strip__track">
            {loop.map((img: any, idx: number) => (
              <img key={`${img._key}-${idx}`} src={urlFor(img).width(200).url()} alt="" />
            ))}
          </div>
        </div>
      );
    },
    videoEmbed: ({ value }) => {
      if (!value?.url) return null;
      const embedUrl = youtubeEmbedUrl(value.url);
      if (!embedUrl) {
        return (
          <p>
            <a href={value.url} target="_blank" rel="noopener noreferrer">
              {value.url}
            </a>
          </p>
        );
      }
      return (
        <div className="pt-video">
          <iframe
            src={embedUrl}
            title="Video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
  },
  block: {
    normal: ({ children, value }) => {
      if (isBoldOnlyBlock(value)) {
        return <h4 className="pt-subheading">{children}</h4>;
      }
      return <p>{children}</p>;
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      );
    },
  },
};

export default function PortableTextBody({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={groupImageStrips(value)} components={components} />;
}
