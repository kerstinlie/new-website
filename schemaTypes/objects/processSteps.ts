import { defineType, defineArrayMember, defineField } from 'sanity';

/**
 * Nummerierte Prozess-/Schritte-Anzeige (z.B. "Publish in just three steps:"
 * mit 01 CONNECT / 02 DEFINE / 03 PUBLISH auf der Startseite). Kam im alten
 * WordPress von einem Elementor-Addon (Timeline Widget), das nicht 1:1
 * uebertragbar ist -> eigener, einfacherer Blocktyp dafuer.
 */
export default defineType({
  name: 'processSteps',
  title: 'Prozess-Schritte',
  type: 'object',
  fields: [
    defineField({
      name: 'steps',
      title: 'Schritte',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          title: 'Schritt',
          fields: [
            defineField({ name: 'label', title: 'Nummer/Label (z.B. "01")', type: 'string' }),
            defineField({ name: 'title', title: 'Titel', type: 'string' }),
            defineField({ name: 'text', title: 'Text', type: 'text' }),
            defineField({ name: 'image', title: 'Bild', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'label' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { steps: 'steps' },
    prepare({ steps }) {
      return { title: `Prozess-Schritte (${steps?.length || 0})` };
    },
  },
});
