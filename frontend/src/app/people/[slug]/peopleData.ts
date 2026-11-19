export interface PersonProfile {
  id: string;
  name: string;
  slug: string;
  role: string;
  badge: string;
  location: string;
  quote: string;
  avatarUrl: string;
  coverUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  viewsCount: string;
  isVerified: boolean;
  website: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  aboutText: string;
  highlights: {
    key: string;
    icon: string;
    title: string;
    description: string;
  }[];
  featuredVideo: {
    title: string;
    subtitle: string;
    thumbnailUrl: string;
    videoUrl?: string;
  };
  updates: {
    id: string;
    type: 'Posts' | 'News' | 'Events';
    title: string;
    description: string;
    date: string;
    imageUrl: string;
    likes: number;
    comments: number;
    shares: number;
  }[];
  gallery: {
    url: string;
    caption: string;
  }[];
  communityStoriesCount: number;
  likesCount: number;
  dislikesCount: number;
}

export const anandSahuProfile: PersonProfile = {
  id: 'BBN-PPL-ANAND-SAHU-001',
  name: 'Anand Sahu',
  slug: 'anand-sahu',
  role: 'Nationalist Thinker & Speaker',
  badge: 'Public Figure',
  location: 'New Delhi, India',
  quote: 'Thoughts for Nation Building and a Stronger India.',
  avatarUrl: '/people/anand-sahu-avatar.jpg',
  coverUrl: 'https://images.unsplash.com/photo-1598890777032-bde13fbe3492?auto=format&fit=crop&w=1600&q=80',
  followersCount: 28400,
  followingCount: 12,
  postsCount: 286,
  viewsCount: '1.2M+',
  isVerified: true,
  website: 'https://anandsahu.com/',
  socialLinks: {
    facebook: 'https://facebook.com/anandsahubjpgpage',
    instagram: 'https://instagram.com/anandsahuindia',
    youtube: 'https://youtube.com/@anandsahu',
    twitter: 'https://x.com/anandsahu',
    linkedin: 'https://linkedin.com/in/anandsahu',
  },
  aboutText:
    'Anand Sahu publishes commentary, event updates and photographs related to public life, social work and political activities. He is known for his nationalist perspective and active engagement in public discourse and youth initiatives.',
  highlights: [
    {
      key: 'education',
      icon: 'GraduationCap',
      title: 'Education',
      description: 'Academic qualifications and institutions',
    },
    {
      key: 'experience',
      icon: 'Briefcase',
      title: 'Experience',
      description: 'BJP youth organization involvement and public work',
    },
    {
      key: 'achievements',
      icon: 'Trophy',
      title: 'Achievements',
      description: 'Key awards, recognitions & contributions',
    },
    {
      key: 'initiatives',
      icon: 'HeartHandshake',
      title: 'Social Initiatives',
      description: 'Community work, youth engagement and nation building',
    },
  ],
  featuredVideo: {
    title: 'Keynote: Youth, Nation & Development',
    subtitle: 'National Youth Conclave 2026',
    thumbnailUrl: '/people/anand-sahu-video.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  updates: [
    {
      id: 'upd-1',
      type: 'News',
      title: 'Guest of Honour at infrastructure awards event',
      description: 'Addressed the event and shared thoughts on infrastructure and development.',
      date: 'June 2026',
      imageUrl: '/people/update-infra.jpg',
      likes: 1800,
      comments: 142,
      shares: 38,
    },
    {
      id: 'upd-2',
      type: 'Events',
      title: 'Visit and meetings in Tashkent',
      description: 'Participated in key meetings and discussed India–Central Asia cooperation.',
      date: '2021',
      imageUrl: '/people/update-tashkent.jpg',
      likes: 980,
      comments: 67,
      shares: 24,
    },
    {
      id: 'upd-3',
      type: 'Posts',
      title: 'Youth Leadership & Nation First Discourse',
      description: 'Delivered an interactive address on youth empowerment, digital public infrastructure, and Atmanirbhar Bharat.',
      date: 'May 2026',
      imageUrl: '/people/gallery-1.jpg',
      likes: 2450,
      comments: 210,
      shares: 89,
    },
  ],
  gallery: [
    {
      url: '/people/gallery-1.jpg',
      caption: 'Public Address & Youth Dialogue',
    },
    {
      url: '/people/gallery-2.jpg',
      caption: 'Bilateral Delegation Meeting in Tashkent',
    },
    {
      url: '/people/gallery-3.jpg',
      caption: 'Keynote on National Development & Governance',
    },
    {
      url: '/people/gallery-4.jpg',
      caption: 'Community Interaction & Rally',
    },
  ],
  communityStoriesCount: 52,
  likesCount: 12400,
  dislikesCount: 342,
};

export const peopleDatabase: Record<string, PersonProfile> = {
  'anand-sahu': anandSahuProfile,
  'anand': anandSahuProfile,
};

export function getPersonBySlug(slug: string): PersonProfile {
  const clean = (slug || '').toLowerCase().trim();
  if (peopleDatabase[clean]) {
    return peopleDatabase[clean];
  }
  return anandSahuProfile;
}
