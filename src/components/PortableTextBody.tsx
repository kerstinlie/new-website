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

// Manche Highlight-Eintraege (z.B. "Leverage dynamic data") haben Titel und
// Beschreibungstext im Original NICHT als zwei getrennte Absaetze, sondern
// als EINEN Block: fette Ueberschrift, gefolgt von einem Zeilenumbruch und
// dem normalen Flie&#223;text, alles im selben Absatz. Dadurch griff die
// isBoldOnlyBlock-Erkennung (die einen Block braucht, der KOMPLETT fett ist)
// nicht und die Ueberschrift blieb schwarz statt rot. Hier wird so ein Block
// in zwei getrennte Bloecke aufgesplittet, bevor er gerendert wird.
function splitLeadingBoldBlocks(blocks: any[]): any[] {
  const out: any[] = [];
  for (const b of blocks || []) {
    const children = b?.children || [];
    if (b?._type === 'block' && b.style === 'normal' && children.length > 1) {
      const allBold = children.every((c: any) => (c.marks || []).includes('strong'));
      const firstIsBold = (children[0]?.marks || []).includes('strong');
      if (!allBold && firstIsBold) {
        let splitIdx = 0;
        while (splitIdx < children.length && (children[splitIdx].marks || []).includes('strong')) {
          splitIdx++;
        }
        const boldChildren = children.slice(0, splitIdx);
        const restChildren = children.slice(splitIdx).map((c: any, i: number) =>
          i === 0 ? { ...c, text: (c.text || '').replace(/^\s+/, '') } : c
        );
        const boldText = boldChildren.map((c: any) => c.text || '').join('').trim();
        const restText = restChildren.map((c: any) => c.text || '').join('').trim();
        if (boldText && boldText.length < 90 && restText) {
          out.push({ ...b, _key: `${b._key}-head`, children: boldChildren });
          out.push({ ...b, _key: `${b._key}-body`, children: restChildren });
          continue;
        }
      }
    }
    out.push(b);
  }
  return out;
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
      const hasCtaLink = (blocks: any[]) =>
        (blocks || []).some(
          (b: any) => (b.markDefs || []).some((m: any) => m._type === 'link') && blockText(b).trim().startsWith('→')
        );
      const hasImg = (blocks: any[]) => (blocks || []).some((b: any) => b._type === 'image');
      // Kacheln mit echtem Foto UND einem Pfeil-Call-to-Action (z.B. die
      // Erfolgsgeschichten "Arkema"/"Festool"/"Vitakraft") sahen im Original
      // nicht wie Karten mit Rahmen aus, sondern wie ein einfaches Foto +
      // Titel + Button innerhalb eines gemeinsamen, sanft eingefaerbten
      // Abschnitts - anders als z.B. das Format-Icon-Grid oder ROI-Kacheln.
      const isStoryGrid = isGrid && cols.some((c: any) => hasImg(c.blocks) && hasCtaLink(c.blocks));
      const gridClass = isStoryGrid ? 'pt-columns pt-columns--story-grid' : isGrid ? 'pt-columns pt-columns--grid' : 'pt-columns';
      return (
        <div className={gridClass} style={gridTemplateColumns ? { gridTemplateColumns } : undefined}>
          {cols.map((col: any) => {
            const hasImage = hasImg(col.blocks);
            // Kacheln ohne eigenes Foto (z.B. wenn kein Bild im Export
            // vorhanden war) bekommen statt eines fehlenden Fotos ein
            // Monogramm aus dem Anfangsbuchstaben der Karten-Ueberschrift.
            const headingBlock = (col.blocks || []).find((b: any) => b._type === 'block');
            const headingText = isGrid && !hasImage ? blockText(headingBlock) : '';
            const colClass = isStoryGrid ? 'pt-column pt-column--story' : isGrid ? 'pt-column pt-column--card' : 'pt-column';
            return (
              <div key={col._key} className={colClass}>
                {headingText && (
                  <div className="pt-column__monogram" aria-hidden="true">
                    {headingText.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <PortableText
                  value={groupImageStrips(splitLeadingBoldBlocks(dedupeConsecutiveBlocks(col.blocks)))}
                  components={components}
                />
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
    gatedForm: ({ value }) => {
      if (!value) return null;
      const formName = value.formGroup || 'contact-request';
      const buttonText = value.buttonText || 'Absenden';
      const thanksParams = new URLSearchParams();
      if (value.redirectUrl) thanksParams.set('redirect', value.redirectUrl);
      if (value.successMessage) thanksParams.set('message', value.successMessage);
      const thanksUrl = `/form-thanks/?${thanksParams.toString()}`;
      return (
        <form
          name={formName}
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action={thanksUrl}
          className="gated-form"
        >
          <input type="hidden" name="form-name" value={formName} />
          {value.redirectUrl && <input type="hidden" name="requested_target" value={value.redirectUrl} />}
          {value.notifyEmail && <input type="hidden" name="notify_email" value={value.notifyEmail} />}
          <p className="gated-form__bot-field">
            <label>
              Bitte nicht ausfüllen: <input name="bot-field" />
            </label>
          </p>
          <div className="gated-form__row">
            <label>
              Name*
              <input type="text" name="name" required />
            </label>
            <label>
              E-Mail*
              <input type="email" name="email" required />
            </label>
          </div>
          <label>
            Firma
            <input type="text" name="company" />
          </label>
          {value.formGroup === 'pdf-download' && (
            <div className="gated-form__options">
              <label className="gated-form__checkbox">
                <input type="checkbox" name="wants_sales_contact" />
                Ich möchte mit einem Vertriebsmitarbeiter sprechen.
              </label>
              <label className="gated-form__checkbox">
                <input type="checkbox" name="wants_newsletter" />
                Ich möchte den Newsletter abonnieren.
              </label>
            </div>
          )}
          <label className="gated-form__consent">
            <input type="checkbox" name="consent" required />
            Ich habe die <a href="/privacy-policy-en">Datenschutzerklärung</a> zur Kenntnis genommen. Hinweis: Sie können Ihre Einwilligung jederzeit für die Zukunft per E-Mail widerrufen.
          </label>
          <button type="submit" className="pt-cta-btn">
            {buttonText}
          </button>
        </form>
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
      // Original-CTAs wie "→ Success Story" waren echte Buttons, keine
      // einfachen Textlinks - werden hier wieder als roter Button dargestellt.
      const firstChild = Array.isArray(children) ? children[0] : children;
      const isCta = typeof firstChild === 'string' && firstChild.trim().startsWith('→');
      return (
        <a
          href={href}
          className={isCta ? 'pt-cta-btn' : undefined}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export default function PortableTextBody({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={groupImageStrips(splitLeadingBoldBlocks(value))} components={components} />;
}
