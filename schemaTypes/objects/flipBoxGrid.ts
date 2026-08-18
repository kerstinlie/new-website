import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Umschlagkarten ("Flip Boxes").
 *
 * Mit 225 Vorkommen der haeufigste Baustein der Originalseite. Jede Karte
 * zeigt eine Vorderseite und klappt bei Mauskontakt auf die Rueckseite um.
 *
 * Der Umschlageffekt wird per CSS geloest, die Bedienung auf Touchgeraeten
 * ueber eine eigene Komponente - Elementors JavaScript wird nicht benoetigt.
 */
export default defineType({
  name: 'flipBoxGrid',
  title: 'Umschlagkarten',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Karten',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'flipBox',
          title: 'Karte',
          fields: [
            defineField({ name: 'frontTitle', title: 'Titel Vorderseite', type: 'string' }),
            defineField({ name: 'frontText', title: 'Text Vorderseite', type: 'text', rows: 3 }),
            defineField({
              name: 'frontImage',
              title: 'Grafik Vorderseite',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'frontBackground',
              title: 'Hintergrundbild Vorderseite',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'backTitle', title: 'Titel Rückseite', type: 'string' }),
            defineField({ name: 'backText', title: 'Text Rückseite', type: 'text', rows: 4 }),
            defineField({
              name: 'backBackground',
              title: 'Hintergrundbild Rückseite',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'buttonText', title: 'Schaltflächen-Text', type: 'string' }),
            defineField({ name: 'buttonHref', title: 'Schaltflächen-Ziel', type: 'string' }),
          ],
          preview: {
            select: { title: 'frontTitle', subtitle: 'backTitle', media: 'frontImage' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }) {
      return { title: `Umschlagkarten (${items?.length || 0})` };
    },
  },
});
