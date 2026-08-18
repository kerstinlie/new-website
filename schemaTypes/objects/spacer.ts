import { defineType, defineField } from 'sanity';

/**
 * Abstandshalter.
 *
 * Die Originalseite erzeugt ihren gesamten vertikalen Rhythmus ueber solche
 * Elemente (4.643 Stueck) - Absaetze selbst haben dort keinen Aussenabstand.
 * Ohne diesen Typ stimmen samtliche Abstaende nicht.
 */
export default defineType({
  name: 'spacer',
  title: 'Abstand',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Höhe (px)',
      type: 'number',
      initialValue: 25,
      description: 'Übliche Werte: 15, 20, 25, 30, 50, 75, 100, 150',
      validation: (Rule) => Rule.min(0).max(400),
    }),
  ],
  preview: {
    select: { size: 'size' },
    prepare({ size }) {
      return { title: `— Abstand ${size ?? 25}px —` };
    },
  },
});
