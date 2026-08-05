import { defineType, defineArrayMember, defineField } from 'sanity';

/**
 * Rotierendes Kundenzitat-Karussell (z.B. auf den Success-Story-Seiten).
 * Kam im alten WordPress entweder vom nativen Elementor-Testimonial-Widget
 * oder vom zweckentfremdeten "Slides"-Widget mit individuell programmiertem
 * HTML pro Zitat.
 */
export default defineType({
  name: 'quoteCarousel',
  title: 'Zitat-Karussell',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Zitate',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'quoteItem',
          title: 'Zitat',
          fields: [
            defineField({ name: 'quote', title: 'Zitat-Text', type: 'text' }),
            defineField({ name: 'authorName', title: 'Name', type: 'string' }),
            defineField({ name: 'authorRole', title: 'Rolle/Firma', type: 'string' }),
            defineField({ name: 'image', title: 'Bild', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'authorName', subtitle: 'quote' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }) {
      return { title: `Zitat-Karussell (${items?.length || 0} Zitate)` };
    },
  },
});
