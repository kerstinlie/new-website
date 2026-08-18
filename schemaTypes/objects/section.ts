import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Ein Seitenabschnitt mit eigenem Aussehen.
 *
 * Im WordPress-Original (Elementor) hatte gut jede zweite Sektion einen
 * eigenen Hintergrund - dieser Wechsel aus farbig abgesetzten Baendern ist
 * der visuelle Rhythmus der Seite. Ohne diesen Typ landete aller Inhalt in
 * einem durchgehend weissen Fluss und die Seiten wirkten flach.
 *
 * Bewusst nur wenige Varianten statt freier Farbwahl: die Auswertung des
 * Exports ergab im Wesentlichen Sandtoene, einen Rotton und zwei Dunkeltoene.
 */
export default defineType({
  name: 'section',
  title: 'Abschnitt',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Hintergrund',
      type: 'string',
      initialValue: 'sand',
      options: {
        list: [
          { title: 'Sand (hell)', value: 'sand' },
          { title: 'Sand-Verlauf', value: 'gradient' },
          { title: 'Dunkel', value: 'dark' },
          { title: 'Akzent (rot)', value: 'accent' },
          { title: 'Ohne (weiss)', value: 'none' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'width',
      title: 'Inhaltsbreite',
      type: 'string',
      initialValue: 'normal',
      description:
        'Normal ist die Standardbreite. Breit eignet sich für Bildstrecken, Karussells und Vorschaureihen - nicht für Fließtext.',
      options: {
        list: [
          { title: 'Normal (1220px)', value: 'normal' },
          { title: 'Breit (1440px)', value: 'wide' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'spacing',
      title: 'Innenabstand',
      type: 'string',
      initialValue: 'normal',
      options: {
        list: [
          { title: 'Klein', value: 'small' },
          { title: 'Normal', value: 'normal' },
          { title: 'Gross', value: 'large' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'blocks',
      title: 'Inhalt',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({ type: 'image', options: { hotspot: true } }),
        defineArrayMember({ type: 'columns' }),
        defineArrayMember({ type: 'iconBoxGrid' }),
        defineArrayMember({ type: 'processSteps' }),
        defineArrayMember({ type: 'videoEmbed' }),
        defineArrayMember({ type: 'heroSlides' }),
        defineArrayMember({ type: 'gatedForm' }),
        defineArrayMember({ type: 'quoteCarousel' }),
        defineArrayMember({ type: 'divider' }),
      ],
    }),
  ],
  preview: {
    select: { variant: 'variant', blocks: 'blocks' },
    prepare({ variant, blocks }) {
      const labels: Record<string, string> = {
        sand: 'Sand',
        gradient: 'Sand-Verlauf',
        dark: 'Dunkel',
        accent: 'Akzent',
        none: 'Ohne',
      };
      const firstText =
        (blocks || []).find((b: any) => b._type === 'block')?.children?.[0]?.text || '';
      return {
        title: `Abschnitt – ${labels[variant] || variant}`,
        subtitle: firstText.slice(0, 60),
      };
    },
  },
});
