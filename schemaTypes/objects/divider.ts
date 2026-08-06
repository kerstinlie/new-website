import { defineType, defineField } from 'sanity';

/**
 * Einfache horizontale Trennlinie (Elementor "Divider"-Widget, z.B. zwischen
 * Logo und Ueberschrift im Hero-Band der Success-Story-Seiten).
 */
export default defineType({
  name: 'divider',
  title: 'Trennlinie',
  type: 'object',
  fields: [
    defineField({ name: 'note', title: 'Notiz (ungenutzt)', type: 'string', hidden: true }),
  ],
  preview: {
    prepare() {
      return { title: '— Trennlinie —' };
    },
  },
});
