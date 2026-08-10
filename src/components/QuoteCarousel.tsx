import { useState } from 'react';
import { urlFor } from '../lib/sanity';

type QuoteItem = {
  _key: string;
  quote?: string;
  authorName?: string;
  authorRole?: string;
  image?: any;
};

export default function QuoteCarousel({ items }: { items: QuoteItem[] }) {
  const [index, setIndex] = useState(0);
  if (!items?.length) return null;
  const item = items[index];
  const go = (delta: number) => setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <div className="quote-carousel">
      <div className="quote-carousel__slide">
        <div className="quote-carousel__text">
          {item.quote && <p className="quote-carousel__quote">„{item.quote}“</p>}
          {(item.authorName || item.authorRole) && (
            <p className="quote-carousel__author">
              {item.authorName && <strong>{item.authorName}</strong>}
              {item.authorRole}
            </p>
          )}
        </div>
        {item.image?.asset && (
          <div className="quote-carousel__image">
            <img src={urlFor(item.image).width(600).url()} alt={item.authorName || ''} />
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div className="quote-carousel__nav">
          <button type="button" className="quote-carousel__arrow" aria-label="Vorheriges Zitat" onClick={() => go(-1)}>
            ‹
          </button>
          <div className="quote-carousel__dots">
            {items.map((it, i) => (
              <button
                key={it._key}
                type="button"
                aria-label={`Zitat ${i + 1}`}
                className={i === index ? 'is-active' : ''}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button type="button" className="quote-carousel__arrow" aria-label="Nächstes Zitat" onClick={() => go(1)}>
            ›
          </button>
        </div>
      )}
    </div>
  );
}
