import { defineType, defineArrayMember, defineField } from 'sanity';

/**
 * Bild-Slider mit Text-Overlay pro Folie (z.B. der rotierende Hero-Bereich auf
 * der Startseite: "InBetween 6.3 is here!", Kundenzitat, Produktscreenshots).
 * Kam im alten WordPress vom Elementor "Slides"-Widget.
 */
export default defineType({
  name: 'heroSlides',
  title: 'Hero-Slider',
  type: 'object',
  fields: [
    defineField({
      name: 'slides',
      title: 'Folien',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroSlide',
          title: 'Folie',
          fields: [
            defineField({ name: 'heading', title: 'Überschrift', type: 'string' }),
            defineField({ name: 'description', title: 'Text', type: 'text' }),
            defineField({ name: 'buttonText', title: 'Button-Text', type: 'string' }),
            defineField({ name: 'buttonHref', title: 'Button-Link', type: 'url' }),
            defineField({ name: 'image', title: 'Bild', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'heading' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { slides: 'slides' },
    prepare({ slides }) {
      return { title: `Hero-Slider (${slides?.length || 0} Folien)` };
    },
  },
});
