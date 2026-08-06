import { defineType, defineArrayMember, defineField } from 'sanity';

/**
 * Mehrspaltiges Layout (z.B. Text + Bild nebeneinander, wie in vielen
 * Elementor-Sektionen der alten WordPress-Seite). Jede Spalte enthält
 * wieder normalen Rich-Text-Inhalt.
 */
export default defineType({
  name: 'columns',
  title: 'Spalten',
  type: 'object',
  fields: [
    defineField({
      name: 'heroBand',
      title: 'Hero-Band (farbiger Hintergrund oben)',
      type: 'object',
      description: 'Optional - nur gesetzt, wenn dies die farbig hinterlegte erste Sektion einer Seite ist (z.B. Success Stories).',
      fields: [
        defineField({ name: 'colorA', title: 'Farbe A', type: 'string' }),
        defineField({ name: 'colorB', title: 'Farbe B', type: 'string' }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Spalten',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          title: 'Spalte',
          fields: [
            defineField({
              name: 'width',
              title: 'Breite (%)',
              type: 'number',
              description: 'Optional – Breite der Spalte in Prozent (z.B. 50 für zwei gleich breite Spalten).',
            }),
            defineField({
              name: 'blocks',
              title: 'Inhalt',
              type: 'array',
              of: [
                { type: 'block' },
                { type: 'image', options: { hotspot: true } },
                { type: 'iconBoxGrid' },
                { type: 'videoEmbed' },
                { type: 'heroSlides' },
                { type: 'gatedForm' },
                { type: 'quoteCarousel' },
                { type: 'divider' },
              ],
            }),
          ],
          preview: {
            select: { blocks: 'blocks' },
            prepare({ blocks }) {
              const firstText =
                blocks?.find((b: any) => b._type === 'block')?.children?.[0]?.text || 'Spalte';
              return { title: firstText };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { columns: 'columns' },
    prepare({ columns }) {
      return { title: `Spalten (${columns?.length || 0})` };
    },
  },
});
