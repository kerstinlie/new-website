import { defineType, defineArrayMember } from 'sanity';

/**
 * Rich-Text-Feld für den Seiteninhalt (ersetzt den WordPress-Editor-Content).
 * Portable Text statt HTML – dadurch bleibt der Inhalt strukturiert und
 * lässt sich in Astro flexibel rendern.
 */
export default defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Überschrift 2', value: 'h2' },
        { title: 'Überschrift 3', value: 'h3' },
        { title: 'Überschrift 4', value: 'h4' },
        { title: 'Zitat', value: 'blockquote' },
      ],
      lists: [
        { title: 'Aufzählung', value: 'bullet' },
        { title: 'Nummeriert', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Fett', value: 'strong' },
          { title: 'Kursiv', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
    }),
    defineArrayMember({ type: 'columns' }),
    defineArrayMember({ type: 'iconBoxGrid' }),
    defineArrayMember({ type: 'processSteps' }),
    defineArrayMember({ type: 'videoEmbed' }),
    defineArrayMember({ type: 'heroSlides' }),
    defineArrayMember({ type: 'gatedForm' }),
    defineArrayMember({ type: 'quoteCarousel' }),
  ],
});
