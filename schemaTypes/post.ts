import { defineField, defineType } from 'sanity';

/**
 * Blog-Beitrag ("post"-Dokument), migriert aus WordPress-Posts.
 * Aehnlich wie "page", aber mit Autor, Kategorien und Excerpt.
 */
export default defineType({
  name: 'post',
  title: 'Blog-Beitrag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-Pfad (Slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mainImage',
      title: 'Titelbild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
    }),
    defineField({
      name: 'categories',
      title: 'Kategorien',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'blockContent',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'datetime',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'author' },
  },
});
