import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../lib/sanity';

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
      return (
        <div className="pt-columns">
          {cols.map((col: any) => (
            <div
              key={col._key}
              className="pt-column"
              style={col.width ? { flexBasis: `${col.width}%` } : undefined}
            >
              <PortableText value={col.blocks} components={components} />
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
