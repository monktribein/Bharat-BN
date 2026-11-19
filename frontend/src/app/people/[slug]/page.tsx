import type { Metadata } from 'next';
import { getPersonBySlug } from './peopleData';
import PeopleProfileClient from './PeopleProfileClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  const title = `${person.name} | ${person.role} - BharatBN™ People Network`;
  const description = `${person.name} - ${person.role} in ${person.location}. ${person.aboutText.slice(0, 150)}... Read verified updates, speeches, and follow on BharatBN™.`;
  const canonicalUrl = `https://bharat-bn.vercel.app/people/${person.slug}`;

  return {
    title,
    description,
    keywords: [
      person.name,
      person.role,
      person.badge,
      'Nationalist Thinker',
      'BharatBN People Network',
      'Verified Public Profile',
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
      siteName: "BharatBN™ India's Business & People Network",
      images: [
        {
          url: person.avatarUrl || 'https://bharat-bn.vercel.app/icon.png',
          width: 800,
          height: 800,
          alt: `${person.name} Portrait`,
        },
      ],
      locale: 'en_IN',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [person.avatarUrl || 'https://bharat-bn.vercel.app/icon.png'],
    },
  };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  // Schema.org Person JSON-LD
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.role,
    description: person.aboutText,
    url: `https://bharat-bn.vercel.app/people/${person.slug}`,
    image: person.avatarUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: person.location,
      addressCountry: 'IN',
    },
    sameAs: Object.values(person.socialLinks).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <PeopleProfileClient person={person} slug={slug} />
    </>
  );
}
