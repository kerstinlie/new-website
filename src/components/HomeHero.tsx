import { useState, useEffect } from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../lib/sanity';

const textComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || '#';
      const isExternal = /^https?:\/\//.test(href);
      const isCta = typeof children?.[0] === 'string' && children[0].startsWith('→');
      return (
        <a
          href={href}
          className={isCta ? 'hero__cta' : undefined}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

function headingLines(block: any): string[] {
  const text = (block?.children || []).map((c: any) => c.text || '').join('');
  return text.split('\n').filter(Boolean);
}

interface Props {
  headingBlock: any;
  textBlocks: any[];
  images: any[];
}

export default function HomeHero({ headingBlock, textBlocks, images }: Props) {
  const [active, setActive] = useState(0);
  const lines = headingLines(headingBlock);
  const validImages = (images || []).filter((img) => img?.asset);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % validImages.length), 4500);
    return () => clearInterval(id);
  }, [validImages.length]);

  return (
    <section className="hero">
      <div className="wrapper hero__inner">
        <div className="hero__text">
          <h1>
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <PortableText value={textBlocks} components={textComponents} />
        </div>
        {validImages.length > 0 && (
          <div className="hero__visual">
            {validImages.map((img, i) => (
              <img
                key={img._key || i}
                src={urlFor(img).width(700).url()}
                alt=""
                className={i === active ? 'hero__slide hero__slide--active' : 'hero__slide'}
              />
            ))}
            {validImages.length > 1 && (
              <div className="hero__dots">
                {validImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === active ? 'hero__dot hero__dot--active' : 'hero__dot'}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
