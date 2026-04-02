import { BASE_URL } from '@/lib/config';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yojanadarpan.in'}/sitemap.xml`,
  };
}
