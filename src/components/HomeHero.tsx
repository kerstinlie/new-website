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

interface Slide {
  _key: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  image?: any;
}

interface Props {
  headingBlock: any;
  textBlocks: any[];
  slides: Slide[];
}

export default function HomeHero({ headingBlock, textBlocks, slides }: Props) {
  const [active, setActive] = useState(0);
  const lines = headingLines(headingBlock);
  const validSlides = (slides || []).filter((s) => s?.image?.asset);

  useEffect(() => {
    if (validSlides.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % validSlides.length), 5000);
    return () => clearInterval(id);
  }, [validSlides.length]);

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
        {validSlides.length > 0 && (
          <div className="hero__visual">
            {validSlides.map((slide, i) => (
              <div key={slide._key || i} className={i === active ? 'hero__slide hero__slide--active' : 'hero__slide'}>
                <img src={urlFor(slide.image).width(900).url()} alt="" />
                {(slide.heading || slide.description) && (
                  <div className="hero__slide-overlay">
                    {slide.heading && <h2>{slide.heading}</h2>}
                    {slide.description && <p>{slide.description}</p>}
                    {slide.buttonText && (
                      <a
                        className="hero__slide-btn"
                        href={slide.buttonHref || '#'}
                        target={/^https?:\/\//.test(slide.buttonHref || '') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                      >
                        {slide.buttonText}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            {validSlides.length > 1 && (
              <div className="hero__dots">
                {validSlides.map((_, i) => (
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
