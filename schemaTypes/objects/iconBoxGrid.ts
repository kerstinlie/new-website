import { defineType, defineArrayMember, defineField } from 'sanity';

/**
 * Feature-/Icon-Box-Grid (z.B. "3 Vorteile nebeneinander" oder
 * "4 Leistungen mit Titel + Beschreibung", wie in vielen Elementor-
 * Sektionen der alten WordPress-Seite verwendet).
 */
export default defineType({
  name: 'iconBoxGrid',
  title: 'Feature-Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Elemente',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'iconBoxItem',
          title: 'Element',
          fields: [
            defineField({ name: 'title', title: 'Titel', type: 'string' }),
            defineField({ name: 'text', title: 'Text', type: 'text' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'text' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }) {
      return { title: `Feature-Grid (${items?.length || 0} Elemente)` };
    },
  },
});
