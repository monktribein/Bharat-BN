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

// ============================================================================
// KASHISH SAXENA CREATOR PROFILE
// ============================================================================
export const kashishProfile: PersonProfile = {
  id: 'BBN-PPL-KASHISH-001',
  name: 'Kashish Saxena',
  slug: 'kashish',
  role: 'Creator & Platform Pioneer',
  badge: 'Creator',
  location: 'Noida, UP',
  quote: 'Empowering local businesses and creators across Bharat.',
  avatarUrl: '', // Clean initial 'K' or user-uploaded image
  coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
  followersCount: 1200,
  followingCount: 8,
  postsCount: 14,
  viewsCount: '42K+',
  isVerified: false,
  website: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  },
  aboutText:
    'Kashish Saxena is a creator, entrepreneur and digital pioneer driving local business discovery, verified creator collaboration, and community initiatives across North India. Passionate about empowering grassroots commerce and self-reliant ecosystems on BharatBN.',
  highlights: [
    {
      key: 'education',
      icon: 'GraduationCap',
      title: 'Education',
      description: 'Bachelor in Technology & Digital Communications',
    },
    {
      key: 'experience',
      icon: 'Briefcase',
      title: 'Experience',
      description: 'Digital Business Transformation & Creator Strategy',
    },
    {
      key: 'achievements',
      icon: 'Trophy',
      title: 'Achievements',
      description: 'Pioneered Hyperlocal Business Verification in Delhi NCR',
    },
    {
      key: 'initiatives',
      icon: 'HeartHandshake',
      title: 'Social Initiatives',
      description: 'Free onboarding workshops for small retailers & MSMEs',
    },
  ],
  featuredVideo: {
    title: 'BharatBN Creator Vision & Digital Growth',
    subtitle: 'Connecting Bharat Entrepreneurs & Local Commerce',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  updates: [
    {
      id: 'upd-k1',
      type: 'Posts',
      title: 'Onboarded 50+ Local Retailers in Sector 18 Noida',
      description: 'Successfully helped local electronic and confectionery businesses set up verified BharatBN storefronts and SEO catalogs.',
      date: 'Today',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80',
      likes: 184,
      comments: 29,
      shares: 12,
    },
    {
      id: 'upd-k2',
      type: 'News',
      title: 'Keynote on Digital Commerce for Bharat at NCR Summit',
      description: 'Shared strategies for Tier-2 and Tier-3 merchants to outrank corporate aggregators using Pay-As-You-Rank technology.',
      date: 'Yesterday',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
      likes: 312,
      comments: 48,
      shares: 26,
    },
  ],
  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      caption: 'Merchant Training Workshop',
    },
    {
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
      caption: 'Panel Discussion on Local Commerce',
    },
  ],
  communityStoriesCount: 6,
  likesCount: 890,
  dislikesCount: 12,
};

// ============================================================================
// DR. RAJESH SHARMA PROFILE
// ============================================================================
export const drRajeshSharmaProfile: PersonProfile = {
  id: 'BBN-PPL-RAJESH-002',
  name: 'Dr. Rajesh Sharma',
  slug: 'dr-rajesh-sharma',
  role: 'Healthcare Pioneer & Dental Surgeon',
  badge: 'Medical Leader',
  location: 'Mumbai, MH',
  quote: 'Making world-class preventive dental healthcare accessible for every Indian.',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  followersCount: 18900,
  followingCount: 15,
  postsCount: 94,
  viewsCount: '450K+',
  isVerified: true,
  website: 'https://apexdentalmumbai.com',
  socialLinks: {},
  aboutText: 'Dr. Rajesh Sharma is a leading maxillofacial surgeon and healthcare innovator dedicated to affordable, technology-driven dental care across western India.',
  highlights: [],
  featuredVideo: {
    title: 'Future of Preventive Healthcare in India',
    subtitle: 'Indian Medical Conclave 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
  updates: [],
  gallery: [],
  communityStoriesCount: 18,
  likesCount: 3200,
  dislikesCount: 18,
};

// ============================================================================
// PRIYA MENON PROFILE
// ============================================================================
export const priyaMenonProfile: PersonProfile = {
  id: 'BBN-PPL-PRIYA-003',
  name: 'Priya Menon',
  slug: 'priya-menon',
  role: 'Clean Tech & EV Policy Advocate',
  badge: 'Policy Voice',
  location: 'Bengaluru, KA',
  quote: 'Sustainable green mobility and public EV infrastructure for modern India.',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
  followersCount: 12500,
  followingCount: 22,
  postsCount: 68,
  viewsCount: '310K+',
  isVerified: true,
  website: '',
  socialLinks: {},
  aboutText: 'Priya Menon is a sustainability strategist advising state governments and commercial fleets on accelerated EV transition and solar charging grids.',
  highlights: [],
  featuredVideo: {
    title: 'Accelerating EV Infrastructure in Smart Cities',
    subtitle: 'Clean Energy Dialogues 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=800&q=80',
  },
  updates: [],
  gallery: [],
  communityStoriesCount: 14,
  likesCount: 4100,
  dislikesCount: 45,
};

// ============================================================================
// VIKRAM SINGHANIA PROFILE
// ============================================================================
export const vikramSinghaniaProfile: PersonProfile = {
  id: 'BBN-PPL-VIKRAM-004',
  name: 'Vikram Singhania',
  slug: 'vikram-singhania',
  role: 'Franchise Enterprise Strategist',
  badge: 'Author & Advisor',
  location: 'Gurugram, HR',
  quote: 'Scaling Bharat homegrown brands into nationwide consumer powerhouses.',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  followersCount: 34100,
  followingCount: 19,
  postsCount: 152,
  viewsCount: '980K+',
  isVerified: true,
  website: '',
  socialLinks: {},
  aboutText: 'Vikram Singhania consults leading Indian retail and F&B brands on franchise expansion, supply chain compliance, and multi-unit scalability.',
  highlights: [],
  featuredVideo: {
    title: 'Building 100-Store Franchise Chains in Bharat',
    subtitle: 'Franchise India Masterclass',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  updates: [],
  gallery: [],
  communityStoriesCount: 32,
  likesCount: 8900,
  dislikesCount: 120,
};

export const peopleDatabase: Record<string, PersonProfile> = {
  'anand-sahu': anandSahuProfile,
  'anand': anandSahuProfile,
  'kashish': kashishProfile,
  'kashish-saxena': kashishProfile,
  'dr-rajesh-sharma': drRajeshSharmaProfile,
  'priya-menon': priyaMenonProfile,
  'vikram-singhania': vikramSinghaniaProfile,
};

export function createDefaultProfileForSlug(slug: string): PersonProfile {
  const cleanName = (slug || 'Profile')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: `BBN-PPL-${(slug || 'USER').toUpperCase()}`,
    name: cleanName,
    slug,
    role: 'Creator & Voice of Bharat',
    badge: 'Creator',
    location: 'India',
    quote: 'Building a stronger connected community across India.',
    avatarUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
    followersCount: 1,
    followingCount: 0,
    postsCount: 0,
    viewsCount: '100+',
    isVerified: false,
    website: '',
    socialLinks: {},
    aboutText: `${cleanName} is a verified profile on BharatBN™ People Network.`,
    highlights: [],
    featuredVideo: {
      title: 'Welcome to BharatBN™ People Network',
      subtitle: 'Connecting India\'s leaders, creators, and entrepreneurs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    updates: [],
    gallery: [],
    communityStoriesCount: 0,
    likesCount: 1,
    dislikesCount: 0,
  };
}

export function getPersonBySlug(slug: string): PersonProfile {
  const clean = (slug || '').toLowerCase().trim();
  if (peopleDatabase[clean]) {
    return peopleDatabase[clean];
  }
  return createDefaultProfileForSlug(clean);
}
