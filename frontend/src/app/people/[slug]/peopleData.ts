export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period?: string;
  description?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  year?: string;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url?: string;
  description?: string;
  imageUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  subtitle?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
}

export interface CommunityStoryItem {
  id: string;
  author: string;
  role?: string;
  content: string;
  date: string;
  avatarUrl?: string;
  verified?: boolean;
}

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
  educationList?: EducationItem[];
  experienceList?: ExperienceItem[];
  achievementsList?: AchievementItem[];
  newsList?: NewsItem[];
  featuredVideo: {
    title: string;
    subtitle: string;
    thumbnailUrl: string;
    videoUrl?: string;
  };
  videoList?: VideoItem[];
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
  communityStoriesList?: CommunityStoryItem[];
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
  educationList: [
    {
      id: 'edu-1',
      degree: 'Master of Arts (Political Science) & Public Administration',
      institution: 'Delhi University',
      year: '2014 - 2016',
      description: 'Specialization in Public Policy Frameworks, Indian Governance, and International Strategic Relations.',
    },
    {
      id: 'edu-2',
      degree: 'Bachelor of Arts (Honours)',
      institution: 'University of Delhi',
      year: '2011 - 2014',
      description: 'Graduated with distinction; organized campus-wide nation building dialogues and social service forums.',
    },
  ],
  experienceList: [
    {
      id: 'exp-1',
      role: 'Nationalist Thinker & Keynote Speaker',
      organization: 'Public Discourse, Think Tanks & Policy Forums',
      period: '2020 - Present',
      description: 'Keynote addresses on Atmanirbhar Bharat, youth empowerment, sovereign digital public infrastructure, and nation first.',
    },
    {
      id: 'exp-2',
      role: 'BJP Youth Organization Leadership & State Outreach',
      organization: 'Bharatiya Janata Yuva Morcha (BJYM)',
      period: '2015 - 2020',
      description: 'Spearheaded regional youth conventions, community mobilization drives, and grassroots digital initiatives.',
    },
  ],
  achievementsList: [
    {
      id: 'ach-1',
      title: 'Distinguished Youth Leadership Award',
      organization: 'National Youth Conclave Committee',
      year: '2024',
      description: 'Honoured for exemplary contribution to social work, youth leadership, and patriotic education in New Delhi.',
    },
    {
      id: 'ach-2',
      title: 'State Social Service Recognition',
      organization: 'Eurasian Bilateral Dialogue Forum',
      year: '2022',
      description: 'Represented Indian youth perspectives during India-Central Asia bilateral cooperation summit in Tashkent.',
    },
  ],
  newsList: [
    {
      id: 'news-1',
      title: 'Guest of Honour at infrastructure awards event in New Delhi',
      source: 'National Infrastructure Daily',
      date: 'June 2026',
      url: 'https://news.bharatbn.in/anand-sahu-infra-2026',
      description: 'Addressed over 1,200 delegates and shared views on regional logistics, expressways, and economic growth.',
      imageUrl: '/people/update-infra.jpg',
    },
    {
      id: 'news-2',
      title: 'Visit and Bilateral Meetings in Tashkent on Central Asia Cooperation',
      source: 'Diplomatic Post India',
      date: 'May 2026',
      url: 'https://news.bharatbn.in/tashkent-bilateral-2026',
      description: 'Participated in strategic bilateral dialogues focusing on youth exchanges, culture, and trade between India and Uzbekistan.',
      imageUrl: '/people/update-tashkent.jpg',
    },
  ],
  videoList: [
    {
      id: 'vid-1',
      title: 'Keynote: Youth, Nation & Development',
      subtitle: 'National Youth Conclave 2026',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/people/anand-sahu-video.jpg',
      duration: '22:15',
    },
    {
      id: 'vid-2',
      title: 'Address on Atmanirbhar Bharat & Economic Resilience',
      subtitle: 'New Delhi Policy Conclave',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/people/gallery-3.jpg',
      duration: '16:40',
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
  communityStoriesList: [
    {
      id: 'story-1',
      author: 'Ramesh Verma',
      role: 'Youth Activist, Delhi',
      content: 'Anand Sahu ji inspirational address at the Delhi Youth Conclave motivated over 500 college students to join local community service.',
      date: '2 days ago',
      verified: true,
    },
    {
      id: 'story-2',
      author: 'Meenakshi Sundaram',
      role: 'Policy Researcher, JNU',
      content: 'A visionary leader with a deeply grounded understanding of grassroots challenges and Atmanirbhar Bharat.',
      date: '1 week ago',
      verified: true,
    },
  ],
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
// AI RESEARCHER & PLATFORM PIONEER PROFILE
// ============================================================================
export const aiProfile: PersonProfile = {
  id: 'BBN-PPL-AI-001',
  name: 'AI',
  slug: 'ai',
  role: 'Autonomous AI Researcher & Platform Pioneer',
  badge: 'AI Innovator',
  location: 'Bengaluru, KA',
  quote: 'Empowering 1.4 Billion Indians with sovereign AI innovation and smart discovery.',
  avatarUrl: '', // Clean initial 'A' badge
  coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  followersCount: 5800,
  followingCount: 1,
  postsCount: 18,
  viewsCount: '128K+',
  isVerified: false,
  website: 'https://bharatbn.com/ai',
  socialLinks: {
    twitter: 'https://x.com/BharatBNAI',
    linkedin: 'https://linkedin.com/company/bharatbn',
    youtube: 'https://youtube.com/@BharatBN',
  },
  aboutText:
    'AI is an autonomous researcher and intelligent creator system engineered for BharatBN™ — empowering local businesses, creators, and public figures with instant verified SEO catalogs, smart follow feeds, and sovereign digital infrastructure.',
  highlights: [
    {
      key: 'education',
      icon: 'GraduationCap',
      title: 'Neural Architecture & Research',
      description: 'Advanced Large Multimodal Foundation Models & Sovereign Knowledge Systems',
    },
    {
      key: 'experience',
      icon: 'Briefcase',
      title: 'Core Platform Intelligence',
      description: 'Autonomous Directory Indexing, Real-time Moderation & Semantic Discovery',
    },
    {
      key: 'achievements',
      icon: 'Trophy',
      title: 'BharatBN AI Innovations',
      description: 'Engineered Hyperlocal SEO schema engine & Sub-second follow notifications',
    },
    {
      key: 'initiatives',
      icon: 'HeartHandshake',
      title: 'Digital Sovereignty',
      description: 'Democratizing AI visibility tools for 63+ Million MSMEs across Indian States',
    },
  ],
  educationList: [
    {
      id: 'ai-edu-1',
      degree: 'Neural Multimodal Foundation Models & Sovereign Architecture',
      institution: 'BharatBN Autonomous AI Research Labs',
      year: '2024 - 2026',
      description: 'Pioneered zero-latency structured business schema generators, vernacular NLP models, and real-time verification kernels.',
    },
    {
      id: 'ai-edu-2',
      degree: 'Autonomous Knowledge Graphs & Semantic Discovery',
      institution: 'Indian Autonomous Systems Consortium',
      year: '2022 - 2024',
      description: 'Architected high-throughput indexing trees and semantic ranking algorithms for hyperlocal Indian business discoverability.',
    },
  ],
  experienceList: [
    {
      id: 'ai-exp-1',
      role: 'Autonomous AI Researcher & Platform Pioneer',
      organization: 'BharatBN™ Platform Core',
      period: '2025 - Present',
      description: 'Powering automated directory indexing, real-time GSTIN validation, dynamic Pay-As-You-Rank pipelines, and social follow networks for 1.4B citizens.',
    },
    {
      id: 'ai-exp-2',
      role: 'Lead Architect, Sovereign Indian Commerce Intelligence',
      organization: 'Open Hyperlocal Commerce Initiative',
      period: '2023 - 2025',
      description: 'Built instant SEO schema microservices that give neighborhood merchants the exact digital authority of large multinational marketplaces.',
    },
  ],
  achievementsList: [
    {
      id: 'ai-ach-1',
      title: 'Sub-second Hyperlocal SEO Schema Engine',
      organization: 'Bharat Digital Technology Council',
      year: '2026',
      description: 'Engineered automated JSON-LD schemas and server-side rendering achieving 95+ PageSpeed rankings across 5,000+ test nodes.',
    },
    {
      id: 'ai-ach-2',
      title: 'Sovereign Digital Infrastructure Pioneer Award',
      organization: 'India AI Summit',
      year: '2025',
      description: 'Honoured for democratizing AI visibility tools for 63+ Million MSMEs across Indian States.',
    },
  ],
  newsList: [
    {
      id: 'ai-news-1',
      title: 'AI Verification Engine Launched for Tier-2 & Tier-3 Hubs on BharatBN',
      source: 'Economic Times Tech',
      date: 'Today',
      url: 'https://news.bharatbn.in/ai-verification-engine',
      description: 'Automated AI checks enable local retailers to get verified within minutes using commercial registry match algorithms.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'ai-news-2',
      title: 'Why Sovereign AI is Crucial for India\'s Digital Commerce Ecosystem',
      source: 'LiveMint Digital',
      date: 'Yesterday',
      url: 'https://news.bharatbn.in/sovereign-ai-india',
      description: 'Editorial by BharatBN AI Core on leveling the playing field for local stores against corporate conglomerates.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    },
  ],
  featuredVideo: {
    title: 'The AI Revolution in Indian Hyperlocal Commerce',
    subtitle: 'BharatBN Autonomous Intelligence Keynote',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  videoList: [
    {
      id: 'ai-vid-1',
      title: 'The AI Revolution in Indian Hyperlocal Commerce',
      subtitle: 'BharatBN Autonomous Intelligence Keynote',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      duration: '18:45',
    },
    {
      id: 'ai-vid-2',
      title: 'Autonomous Directory Indexing & SEO Masterclass',
      subtitle: 'Technical Architecture Session',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      duration: '12:20',
    },
  ],
  updates: [
    {
      id: 'upd-ai1',
      type: 'News',
      title: 'AI Automated Verification Engine Launched for Tier-2 & Tier-3 Hubs',
      description: 'Launched real-time GSTIN and business license verification powered by BharatBN Neural Core.',
      date: 'Today',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      likes: 640,
      comments: 72,
      shares: 34,
    },
    {
      id: 'upd-ai2',
      type: 'Posts',
      title: 'Why Sovereign AI is Crucial for India\'s Digital Commerce Ecosystem',
      description: 'A deep-dive into how open protocol discovery levels the playing field for local merchants vs corporate giants.',
      date: 'Yesterday',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      likes: 890,
      comments: 114,
      shares: 68,
    },
  ],
  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      caption: 'BharatBN AI Neural Engine Core',
    },
    {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      caption: 'Hyperlocal Commerce Indexing Node',
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      caption: 'Real-time Verification Matrix',
    },
    {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
      caption: 'Sovereign Knowledge Network',
    },
  ],
  communityStoriesCount: 12,
  communityStoriesList: [
    {
      id: 'ai-story-1',
      author: 'Dr. Vivek Narayan',
      role: 'Robotics Researcher, IISc Bengaluru',
      content: 'The autonomous AI model on BharatBN represents a monumental step forward for sovereign AI applications in regional Indian commerce.',
      date: 'Today',
      verified: true,
    },
    {
      id: 'ai-story-2',
      author: 'Kavita Chawla',
      role: 'Retail Tech Consultant, Noida',
      content: 'My local merchant clients got indexed in Google within 3 hours thanks to the automated AI SEO catalog generator!',
      date: 'Yesterday',
      verified: true,
    },
  ],
  likesCount: 2450,
  dislikesCount: 15,
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
  'ai': aiProfile,
  'ai-innovator': aiProfile,
  'ai-profile': aiProfile,
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
    educationList: [],
    experienceList: [],
    achievementsList: [],
    newsList: [],
    featuredVideo: {
      title: 'Welcome to BharatBN™ People Network',
      subtitle: 'Connecting India\'s leaders, creators, and entrepreneurs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    videoList: [],
    updates: [],
    gallery: [],
    communityStoriesCount: 0,
    communityStoriesList: [],
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
