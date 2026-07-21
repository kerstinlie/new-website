import { defineField, defineType } from 'sanity';

/**
 * Generisches "page"-Dokument für die WordPress-Migration.
 * Deckt die typische Struktur einer WP-Seite ab: Titel, Slug/URL,
 * Titelbild, Inhalt (Rich Text) sowie SEO-Felder.
 * Bei Bedarf könnt ihr später weitere Types (z. B. "post", "author",
 * "category") ergänzen, falls ihr Blog-Beiträge separat abbilden wollt.
 */
export default defineType({
  name: 'page',
  title: 'Seite',
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
      name: 'heroImage',
      title: 'Titelbild',
      type: 'image',
      options: { hotspot: true },
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
    select: { title: 'title', media: 'heroImage' },
  },
});
