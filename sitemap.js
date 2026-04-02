import { SCHEMES, STATES, CATEGORIES } from '@/data/schemes';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yojanadarpan.in';

export default function sitemap() {
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/find`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/schemes`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/states`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Individual scheme pages (SEO powerhouse — each gets indexed)
  const schemePages = SCHEMES.map((scheme) => ({
    url: `${BASE_URL}/schemes/${scheme.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // State pages
  const statePages = STATES.map((state) => ({
    url: `${BASE_URL}/states/${state.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...schemePages, ...statePages];
}
