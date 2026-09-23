import raw from './posts.json';

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: { src: string; width: number; height: number } | null;
  images: number;
  words: number;
  html: string;
};

export const posts = raw as Post[];

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

export const readingMinutes = (p: Post) => Math.max(1, Math.round(p.words / 200));
