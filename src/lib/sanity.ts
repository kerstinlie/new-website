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
  language?: 'en' | 'de';
  heroImage?: any;
  body?: any;
  publishedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
};

export async function getAllPages(): Promise<SanityPage[]> {
  return sanityClient.fetch(
    `*[_type == "page" && defined(slug.current)]{ _id, title, slug, language, heroImage, body, publishedAt, seo }`
  );
}

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  return sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]{ _id, title, slug, language, heroImage, body, publishedAt, seo }`,
    { slug }
  );
}

export type SanityPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  author?: string;
  categories?: string[];
  body?: any;
  publishedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean };
};

export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){ _id, title, slug, excerpt, mainImage, author, categories, publishedAt }`
  );
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ _id, title, slug, excerpt, mainImage, author, categories, body, publishedAt, seo }`,
    { slug }
  );
}
