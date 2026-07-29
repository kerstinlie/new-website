import { defineType, defineField } from 'sanity';

/**
 * Eingebettetes Video (z.B. YouTube-Link aus einem Elementor Video-Widget).
 */
export default defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  fields: [defineField({ name: 'url', title: 'Video-URL', type: 'url' })],
  preview: {
    select: { url: 'url' },
    prepare({ url }) {
      return { title: `Video: ${url || ''}` };
    },
  },
});
