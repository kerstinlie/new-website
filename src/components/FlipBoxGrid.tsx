import { useState } from 'react';
import { urlFor } from '../lib/sanity';

type FlipBox = {
  _key: string;
  frontTitle?: string;
  frontText?: string;
  frontImage?: any;
  frontBackground?: any;
  backTitle?: string;
  backText?: string;
  backBackground?: any;
  buttonText?: string;
  buttonHref?: string;
};

function bgStyle(image: any) {
  if (!image?.asset) return undefined;
  return { backgroundImage: `url(${urlFor(image).width(800).url()})` };
}

/**
 * Umschlagkarten.
 *
 * Der Umschlageffekt laeuft ueber CSS (Mauskontakt und Tastaturfokus). Fuer
 * Touchgeraete, wo es kein Hover gibt, schaltet ein Antippen die Karte um -
 * dafuer reicht dieser kleine Zustand, Elementors Frontend-JS wird nicht
 * gebraucht.
 */
export default function FlipBoxGrid({ items }: { items: FlipBox[] }) {
  const [offen, setOffen] = useState<string | null>(null);
  if (!items?.length) return null;

  return (
    <div className="pt-flip-grid">
      {items.map((item) => {
        const hatRueckseite = Boolean(item.backTitle || item.backText || item.buttonText);
        const istOffen = offen === item._key;
        return (
          <div
            key={item._key}
            className={`pt-flip${istOffen ? ' is-open' : ''}${hatRueckseite ? '' : ' pt-flip--static'}`}
          >
            <button
              type="button"
              className="pt-flip__inner"
              aria-expanded={hatRueckseite ? istOffen : undefined}
              onClick={() => hatRueckseite && setOffen(istOffen ? null : item._key)}
            >
              <span className="pt-flip__face pt-flip__front" style={bgStyle(item.frontBackground)}>
                {item.frontImage?.asset && (
                  <img
                    className="pt-flip__icon"
                    src={urlFor(item.frontImage).width(200).url()}
                    alt=""
                  />
                )}
                {item.frontTitle && <span className="pt-flip__title">{item.frontTitle}</span>}
                {item.frontText && <span className="pt-flip__text">{item.frontText}</span>}
              </span>

              {hatRueckseite && (
                <span className="pt-flip__face pt-flip__back" style={bgStyle(item.backBackground)}>
                  {item.backTitle && <span className="pt-flip__title">{item.backTitle}</span>}
                  {item.backText && <span className="pt-flip__text">{item.backText}</span>}
                  {item.buttonText && <span className="pt-flip__btn">{item.buttonText}</span>}
                </span>
              )}
            </button>

            {/* Der Link liegt bewusst ausserhalb der Schaltflaeche - verschachtelte
                interaktive Elemente sind nicht zulaessig und brechen die
                Tastaturbedienung. */}
            {item.buttonHref && item.buttonText && (
              <a className="pt-flip__link" href={item.buttonHref}>
                {item.buttonText}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
