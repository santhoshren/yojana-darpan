import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata = {
  title: {
    default: 'YojanaDarpan - Find All Government Schemes You Qualify For',
    template: '%s | YojanaDarpan',
  },
  description:
    'India\'s most comprehensive government scheme eligibility finder. Discover 3000+ central and state government schemes, subsidies, loans, and benefits you qualify for — free forever.',
  keywords: [
    'government schemes India',
    'sarkari yojana',
    'PM Kisan',
    'PM Awas Yojana',
    'eligibility checker',
    'government benefits',
    'scholarship India',
    'subsidy India',
  ],
  authors: [{ name: 'YojanaDarpan' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'YojanaDarpan',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YojanaDarpan - Find Government Schemes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YojanaDarpan - Find All Government Schemes',
    description: 'Discover 3000+ government schemes you qualify for — free forever.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_CLIENT} />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
