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
      // Bei 3 oder mehr schmalen Spalten in einer Reihe sieht es optisch besser
      // aus, sie als Karten-Grid darzustellen (z.B. Format-Icons, ROI-Kacheln).
      const isGrid = cols.length >= 3;
      return (
        <div className={isGrid ? 'pt-columns pt-columns--grid' : 'pt-columns'}>
          {cols.map((col: any) => (
            <div
              key={col._key}
              className={isGrid ? 'pt-column pt-column--card' : 'pt-column'}
              // Grid-Modus nutzt CSS Grid (auto-fit) statt Flex-Prozentbreiten,
              // da Flex-Basis in % zusammen mit "gap" bei vollen Reihen leicht
              // umbricht und die letzte Karte auf volle Breite zieht.
              style={!isGrid && col.width ? { flexBasis: `${col.width}%` } : undefined}
            >
              <PortableText value={dedupeConsecutiveBlocks(col.blocks)} components={components} />
            </div>
          ))}
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
  return <PortableText value={value} components={components} />;
}
