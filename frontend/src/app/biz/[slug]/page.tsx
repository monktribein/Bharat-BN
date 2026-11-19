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

  // Exact SEO Title: Primary keyword (business name) at beginning, followed by city
  const title =
    business.seoTitle ||
    (business.city ? `${business.name} | ${business.city}` : business.name);

  // Business About / Description directly used in meta description as requested
  const description =
    business.seoDescription ||
    business.description ||
    business.aboutStory ||
    `Explore ${business.name} in ${business.landmark || business.city || 'India'}. Discover verified services, authentic customer reviews, operating hours and contact details on BharatBN™ Business Network.`;

  const canonicalUrl = `https://bharat-bn.vercel.app/biz/${slug}`;

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
    description: business.seoDescription || business.description || business.aboutStory,
    image: business.gallery?.[0]?.url || 'https://bharat-bn.vercel.app/icon.png',
    telephone: business.phone,
    email: business.email,
    url: `https://bharat-bn.vercel.app/biz/${slug}`,
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
