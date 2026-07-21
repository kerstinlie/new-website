import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta-Titel',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Sollte unter 60 Zeichen bleiben'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta-Beschreibung',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Sollte unter 160 Zeichen bleiben'),
    }),
    defineField({
      name: 'noIndex',
      title: 'Von Suchmaschinen ausschließen',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
