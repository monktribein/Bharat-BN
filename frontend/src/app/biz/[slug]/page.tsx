import type { Metadata } from 'next';
import { getBusinessBySlug } from './businessData';
import BusinessProfileClient from './BusinessProfileClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  // Exact SEO Title as requested in audit: Primary keyword at beginning followed by city
  const title = `${business.name} | ${business.city}`;

  // Tailored description matching exact audit recommendations
  const description = business.name.toLowerCase().includes('choco')
    ? 'Explore Choco Delights & Confectionery (Cadboury) in Andheri West, Mumbai. Discover artisan chocolates, gift hampers, reviews, timings and contact details.'
    : `Explore ${business.name} in ${business.landmark || business.city}. Discover verified services, authentic customer reviews, operating hours and contact details on BharatBN™ Business Network.`;

  const canonicalUrl = `https://bharat-bn.vercel.app/biz/${business.slug}`;

  return {
    title,
    description,
    keywords: [
      business.name,
      `${business.name} ${business.city}`,
      business.category,
      'Verified Local Business',
      'BharatBN Directory',
      ...(business.services || []).slice(0, 5),
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'BharatBN™ Business Network',
      images: [
        {
          url: business.gallery?.[0]?.url || 'https://bharat-bn.vercel.app/icon.png',
          width: 1200,
          height: 630,
          alt: `${business.name} Showcase Pavilion`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [business.gallery?.[0]?.url || 'https://bharat-bn.vercel.app/icon.png'],
    },
  };
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);

  // Schema.org LocalBusiness Structured Data for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    image: business.gallery?.[0]?.url || 'https://bharat-bn.vercel.app/icon.png',
    telephone: business.phone,
    email: business.email,
    url: `https://bharat-bn.vercel.app/biz/${business.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.addressLine,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.pincode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.1363',
      longitude: '72.8277',
    },
    priceRange: '₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(business.rating),
      reviewCount: String(business.reviewsCount),
      bestRating: '5',
      worstRating: '1',
    },
    openingHoursSpecification: business.workingHours?.map((wh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: wh.days.includes('Sunday')
        ? ['Sunday']
        : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '21:00',
    })) || [],
  };

  return (
    <>
      {/* Server-Rendered JSON-LD for Google Crawler & Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Interactive Client Body with Live localStorage dynamic sync */}
      <BusinessProfileClient initialBusiness={business} slug={slug} />
    </>
  );
}
