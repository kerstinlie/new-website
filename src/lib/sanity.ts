import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: import.meta.env.PROD, // im Dev-Modus immer frische Daten, im Build gecacht
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export type SanityPage = {
  _id: string;
  title: string;
  slug: { current: string };
  heroImage?: any;
  body?: any;
  publishedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
};

export async function getAllPages(): Promise<SanityPage[]> {
  return sanityClient.fetch(
    `*[_type == "page" && defined(slug.current)]{ _id, title, slug, heroImage, body, publishedAt, seo }`
  );
}

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  return sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ _id, title, slug, heroImage, body, publishedAt, seo }`,
    { slug }
  );
}
