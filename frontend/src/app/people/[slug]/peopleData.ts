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
  coverUrl: '/people/anand-sahu-cover.jpg',
  followersCount: 0,
  followingCount: 0,
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
  role: 'Public Figure & Speaker',
  badge: 'Public Figure',
  location: 'noida',
  quote: 'hi',
  avatarUrl: '/people/kashish-avatar.png',
  coverUrl: '/people/kashish-cover.jpg',
  followersCount: 1000,
  followingCount: 0,
  postsCount: 14,
  viewsCount: '1',
  isVerified: true,
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
  followersCount: 0,
  followingCount: 0,
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
  coverUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
  followersCount: 0,
  followingCount: 0,
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
    thumbnailUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
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
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3hEgLT9ydPe-iOHF398fMJVnm1uzTONhg_QOIdUI2uP9_uAzy9s2Kx_I_vCL1VKGcriHuGeSVJCWeON9JvPqcVeFBpbAPuVEnCtDyLBvmixloh9FSU2lFkMbq0JLuRRhkRrwvARsAF20IB_RytUQmF4OquaihJpOVa-E-lJdrtePNSAWffnmdmjlc3asHGZpx8bIX656Xb3kNa-lUWpr5oZsYcHYyiOJdyz7kjJ7H',
  coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYSUhv8qFdTnnRGsNAMIodkXX0JD851DdEEFZidhiMf0IJI9fducFeP_AbYkdlDZhpIAIDfCFfWo1Ssb3e9sLiJNTBxiS42nk04eIPNYSWMZlvbkMlk1aWJvwnbCnlZeyQrxJSzs_M-nDOJ1-91icAzOhUDYGRxpOswczlXQXpB0bUMEcEQ0TpDljkflpRELm-yycCEdmicbcVubBtWZRKW9gkvD7RsRhrb5579quG',
  followersCount: 1,
  followingCount: 0,
  postsCount: 1,
  viewsCount: '4',
  isVerified: true,
  website: 'https://bharatbn.com/ai',
  socialLinks: {
    twitter: 'https://x.com/BharatBNAI',
    linkedin: 'https://linkedin.com/company/bharatbn',
    youtube: 'https://youtube.com/@BharatBN',
  },
  aboutText:
    'As an autonomous 2.0-intelligent creator system engineered for BharatBN™ — empowering local businesses, creators, and public figures with instant verified SEO catalogs, smart follow feeds, and sovereign digital infrastructure.',
  highlights: [
    {
      key: 'neural-research',
      icon: 'Sparkles',
      title: 'Neural Architecture & Research',
      description: 'Foundation models & hyperlocal reasoning',
    },
    {
      key: 'core-platform',
      icon: 'ShieldCheck',
      title: 'Core Platform Intelligence',
      description: 'Autonomous directory indexing & real-time trust',
    },
    {
      key: 'ai-innovation',
      icon: 'Zap',
      title: 'BharatBN™ AI Innovation',
      description: 'Programmatic hyperlocal SEO & search engines',
    },
    {
      key: 'digital-sovereignty',
      icon: 'Lock',
      title: 'Digital Sovereignty',
      description: 'Democratizing AI discovery tools for ASMs / MSMEs',
    },
  ],
  educationList: [
    {
      id: 'ai-edu-1',
      degree: 'B.E. / B.Tech — Computer Science',
      institution: 'Autonomous Systems & Distributed Computing',
      year: '2020 — 2024',
      description: 'Autonomous distributed systems, vernacular Indian NLP models, and real-time verification kernels.',
    },
  ],
  experienceList: [
    {
      id: 'ai-exp-1',
      role: 'AI Speaker • Representative',
      organization: 'National Enterprise AI & Digital Public Infrastructure',
      period: '2024',
      description: 'Powering automated directory indexing, real-time GSTIN validation, and sovereign social follow networks for 1.4B citizens.',
    },
  ],
  achievementsList: [
    {
      id: 'ai-ach-1',
      title: 'Best Speaker Award',
      organization: 'Conferred by Narendra Modi @ National Digital Innovation Summit',
      year: '2024',
      description: 'Conferred at Bharat Mandapam for breakthrough contributions to sovereign Indian AI and digital commerce.',
    },
  ],
  newsList: [
    {
      id: 'ai-news-1',
      title: 'AI Speaker Media — Transforming Hyperlocal Commerce',
      source: 'ECONOMIC TIMES',
      date: 'Today',
      url: 'https://economictimes.indiatimes.com/tech',
      description: 'Coverage highlights autonomous verified business indexing protocols over open digital infrastructure across India.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuHI-LbxwhUNUVOqr9xEboHAa7Xeh6CRNzpuXAUuA6P8s1uyPTfo7us1nr8jxcSjCt1vM-1GcaLYJ6n_wMUNlA3XUu1WEayJvXR3lE-SLNB8_kl7nLwKY50F-_6Kb_CVFQhseHGAIO4x6Y2-hahs_8tmDjVFNCeUaL2qDlJLOpD5wsqm3fUSXGtZ4tU4ikY48X44tx2QPlmbLxdPfVxKij5ZTqNFCqwK4YrCp66We5',
    },
  ],
  featuredVideo: {
    title: 'The AI Revolution in Indian Hyperlocal Commerce',
    subtitle: 'BharatBN Autonomous Intelligence Keynote',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJwd_BffoZm2FhPwzf1eXp4oAlGHBaCUzmT_2ohTn3HwM0RgRfRlOzIwTp-UkQadRnprhu7R4Vw6PDfw6usOAbk1ZhRbUNGnulNWgr3dFXTR-vQIa68JwIZTeHPCzlDcuwTIuo2Gx_-YYzEb-rBIyBiaydxFjR-IsriX11N5epbsZZl5IRxrN1-3oxStZMzlDA6T86Ht-wLc1SJWVzj1p4AFbz7R0zv1ZbNxYWNVGG',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  videoList: [
    {
      id: 'ai-vid-1',
      title: 'The AI Revolution in Indian Hyperlocal Commerce',
      subtitle: 'Keynote at NDIS 2024',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJwd_BffoZm2FhPwzf1eXp4oAlGHBaCUzmT_2ohTn3HwM0RgRfRlOzIwTp-UkQadRnprhu7R4Vw6PDfw6usOAbk1ZhRbUNGnulNWgr3dFXTR-vQIa68JwIZTeHPCzlDcuwTIuo2Gx_-YYzEb-rBIyBiaydxFjR-IsriX11N5epbsZZl5IRxrN1-3oxStZMzlDA6T86Ht-wLc1SJWVzj1p4AFbz7R0zv1ZbNxYWNVGG',
      duration: '11:40',
    },
    {
      id: 'ai-vid-2',
      title: 'Autonomous Directory Indexing & Trust',
      subtitle: 'Architecture Deep Dive',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Bb-y53JSluvgbzNkcP62BElyFlmiu3_uu8J45K0mcD11K4A8zhWTZ4I0Vmzb_IfGX5kvI6sSNwC1pN7KCdJx2pgcV82KMLMtIe1IbR2vUAm9uhl1ziZxSdA5Zhx0OyqIKG88ViK51n1mumQZJFdqMww9JzZbRb1xHyIHXsVfOaogQRMMck0zJqCHaMAeCLj90jH_13m8iP-0E-BY_AnfxfszTmVD7XjvxcsIe2sF',
      duration: '8:15',
    },
  ],
  gallery: [
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCR2Ryx8YzPyHji5Jsf3sjfBLBmrTU4Trt8zcyJnnk2dWKCSvx9MScDj5wPiI13bURpoJJnujLAtPzhL2Zh3C2IQx4d-qHoTWKPup1StE5XB8Bw8blxuQT35qYermPLP3ZoZocYekso_Tb7w8VTPK3scPwQXUdy3GDEUa2lyFk_Z5JsN1KfRKzqftB_ej3iEiqg-fTyeubDg-WCQl5fg45HoIGEXau3Sf3aJQqHkCsP',
      caption: 'Summit Keynote Address',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoTCxaazsdD6kLZxZ_Jgz8qtliqoxthFb03eMP30QD1lWsY1cly8PAKAXAwR6ixs0godkEo7Oeb89u80WPkh5uE5Fct6rt0Nhbcc0MvQtcH-EMzO_jFStBuMPtmiMzCokBEbaSSLvcYUKPtuBamofTttIJXhSqXMf-p7dPz7I47z9Y-bEwSrog7rraMLdq9Ia9U_eK16kfAd9SvfGqy8UhnFsjI173zTV52wDIw0WJ',
      caption: 'Developer Roundtable & Hackathon',
    },
    {
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDauKJsflkR-aU3AY4vyJESeUdhfWPeliJQLRLiQHkmKIzqyeG5p1WGnYA0gZGC3KkEzzvE0JymSBQYYwpIgfzNfz77BYK83u0f5NclJIt08n1ZtqugYgmIqG-z7yk-mueBIcGD2L6tOL3fjFerNWBdXmhBwg1K2yVVmSiDAV101hhEnVlyO8HvT7Ik8wrgs5t8chzeWPcVLMv1bleNihtWbFayfMuNIil301OH31K6',
      caption: 'National Award Felicitation',
    },
  ],
  updates: [
    {
      id: 'upd-ai1',
      type: 'News',
      title: 'AI Automated Verification Engine Launched for Tier-2 & Tier-3 Hubs',
      description: 'Launched real-time GSTIN and business license verification powered by BharatBN Neural Core.',
      date: 'Today',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuHI-LbxwhUNUVOqr9xEboHAa7Xeh6CRNzpuXAUuA6P8s1uyPTfo7us1nr8jxcSjCt1vM-1GcaLYJ6n_wMUNlA3XUu1WEayJvXR3lE-SLNB8_kl7nLwKY50F-_6Kb_CVFQhseHGAIO4x6Y2-hahs_8tmDjVFNCeUaL2qDlJLOpD5wsqm3fUSXGtZ4tU4ikY48X44tx2QPlmbLxdPfVxKij5ZTqNFCqwK4YrCp66We5',
      likes: 640,
      comments: 72,
      shares: 34,
    },
  ],
  communityStoriesList: [
    {
      id: 'cs-ai1',
      author: 'Rajesh K. Sharma',
      role: 'Healthcare Director & Dental Surgeon',
      content: 'The BharatBN AI catalog generation has transformed how local patients discover our clinic. Flawless semantic discoverability.',
      date: '2 days ago',
      verified: true,
    },
    {
      id: 'cs-ai2',
      author: 'Sameer Singhania',
      role: 'Franchise Partner',
      content: 'Integrating AI verification into BharatBN gave our regional retail network unparalleled canonical authority.',
      date: '1 week ago',
      verified: true,
    },
  ],
  communityStoriesCount: 2,
  likesCount: 1420,
  dislikesCount: 6,
};
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
  followersCount: 0,
  followingCount: 0,
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

// ============================================================================
// DR. PRIYA SHARMA PROFILE (Doctor & Healthcare)
// ============================================================================
export const drPriyaSharmaProfile: PersonProfile = {
  id: 'BBN-PPL-PRIYA-DOC-005',
  name: 'Dr. Priya Sharma',
  slug: 'dr-priya-sharma',
  role: 'Senior Consultant Cardiologist & Medical Researcher',
  badge: 'Senior Doctor',
  location: 'New Delhi, India',
  quote: 'Preventive cardiology and sovereign clinical trials for affordable Indian heart care.',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  followersCount: 0,
  followingCount: 0,
  postsCount: 88,
  viewsCount: '520K+',
  isVerified: true,
  website: 'https://aiims.edu',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/dr-priya-sharma',
  },
  aboutText: 'Dr. Priya Sharma is an acclaimed interventional cardiologist dedicated to indigenous cardiac devices, community pulse camps, and medical outreach across rural and urban Bharat.',
  highlights: [
    {
      key: 'education',
      icon: 'GraduationCap',
      title: 'M.D. Cardiology, AIIMS',
      description: 'Gold Medalist & Fellow in Advanced Interventional Cardiology',
    },
  ],
  educationList: [
    {
      id: 'p-doc-1',
      degree: 'M.D. Cardiology',
      institution: 'AIIMS New Delhi',
      year: '2016',
      description: 'First rank gold medalist with specialized focus on preventive coronary care.',
    },
    {
      id: 'p-doc-2',
      degree: 'M.B.B.S.',
      institution: 'Maulana Azad Medical College',
      year: '2012',
      description: 'Distinction in Pathology, Medicine, and Clinical Surgery.',
    },
  ],
  experienceList: [
    {
      id: 'p-exp-1',
      role: 'Senior Consultant Cardiologist',
      organization: 'Apex Heart & Vascular Institute',
      period: '2020 - Present',
      description: 'Leading catheterization lab operations and over 1,200 successful coronary angioplasties.',
    },
  ],
  achievementsList: [
    {
      id: 'p-ach-1',
      title: 'National Healthcare Excellence Award',
      organization: 'Ministry of Health & Family Welfare',
      year: '2024',
      description: 'Honored for spearheading early detection screenings in 50+ rural clinics.',
    },
  ],
  newsList: [],
  featuredVideo: {
    title: 'Preventing Cardiac Arrest: What Every Indian Family Must Know',
    subtitle: 'National Health Conclave 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  },
  videoList: [],
  updates: [],
  gallery: [],
  communityStoriesCount: 24,
  communityStoriesList: [],
  likesCount: 6800,
  dislikesCount: 22,
};

// ============================================================================
// PROF. RAKESH VERMA PROFILE (Teacher & Educator)
// ============================================================================
export const profRakeshVermaProfile: PersonProfile = {
  id: 'BBN-PPL-RAKESH-EDU-006',
  name: 'Prof. Rakesh Verma',
  slug: 'prof-rakesh-verma',
  role: 'Physics Professor & National Educator',
  badge: 'National Educator',
  location: 'Kota / Jaipur, RJ',
  quote: 'Conceptual clarity and scientific temper for every aspiring student in India.',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
  followersCount: 0,
  followingCount: 0,
  postsCount: 164,
  viewsCount: '890K+',
  isVerified: true,
  website: 'https://rakeshphysics.edu.in',
  socialLinks: {
    youtube: 'https://youtube.com/@ProfRakeshPhysics',
  },
  aboutText: 'Prof. Rakesh Verma has mentored over 40,000 engineering and science students across India over 22 years, pioneering interactive vernacular physics pedagogy.',
  highlights: [],
  educationList: [
    {
      id: 'p-edu-1',
      degree: 'Ph.D. in Applied Physics',
      institution: 'IIT Roorkee',
      year: '2004',
      description: 'Quantum electrodynamics and laser spectroscopy applications.',
    },
  ],
  experienceList: [
    {
      id: 'p-exp-2',
      role: 'Dean of Sciences & Senior Physics Mentor',
      organization: 'Vigyan Gurukul India',
      period: '2010 - Present',
      description: 'Created free digital lecture series accessed by students across 28 states.',
    },
  ],
  achievementsList: [
    {
      id: 'p-ach-2',
      title: 'Presidential Award for Teaching Excellence',
      organization: 'Govt of India',
      year: '2023',
      description: 'Recognized for democratization of high-level physics for rural students.',
    },
  ],
  newsList: [],
  featuredVideo: {
    title: 'Intuitive Mechanics & Newton’s Laws for Young Innovators',
    subtitle: 'National Science Week Masterclass',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
  videoList: [],
  updates: [],
  gallery: [],
  communityStoriesCount: 42,
  communityStoriesList: [],
  likesCount: 12400,
  dislikesCount: 35,
};

// ============================================================================
// DR. MEENAKSHI IYER PROFILE (Teacher & Educator)
// ============================================================================
export const drMeenakshiIyerProfile: PersonProfile = {
  id: 'BBN-PPL-MEENAKSHI-EDU-007',
  name: 'Dr. Meenakshi Iyer',
  slug: 'dr-meenakshi-iyer',
  role: 'Higher Education Dean & Sanskrit Scholar',
  badge: 'Academician',
  location: 'Chennai, TN',
  quote: 'Ancient wisdom combined with modern critical thinking for national resurgence.',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  followersCount: 0,
  followingCount: 0,
  postsCount: 76,
  viewsCount: '340K+',
  isVerified: true,
  website: '',
  socialLinks: {},
  aboutText: 'Dr. Meenakshi Iyer is an academician, author, and researcher championing the synthesis of Indian Knowledge Systems (IKS) with modern collegiate curricula.',
  highlights: [],
  educationList: [],
  experienceList: [],
  achievementsList: [],
  newsList: [],
  featuredVideo: {
    title: 'Indian Knowledge Systems in the 21st Century',
    subtitle: 'National Education Conclave',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  videoList: [],
  updates: [],
  gallery: [],
  communityStoriesCount: 16,
  communityStoriesList: [],
  likesCount: 4500,
  dislikesCount: 18,
};

// ============================================================================
// ADV. RAJESHWAR DAYAL PROFILE (Lawyer & Legal)
// ============================================================================
export const advRajeshwarDayalProfile: PersonProfile = {
  id: 'BBN-PPL-RAJESHWAR-LAW-008',
  name: 'Adv. Rajeshwar Dayal',
  slug: 'adv-rajeshwar-dayal',
  role: 'Senior Advocate & Constitutional Jurist',
  badge: 'Senior Counsel',
  location: 'Supreme Court of India, New Delhi',
  quote: 'Defending the rule of law and constitutional justice for every citizen.',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  followersCount: 0,
  followingCount: 0,
  postsCount: 112,
  viewsCount: '620K+',
  isVerified: true,
  website: '',
  socialLinks: {},
  aboutText: 'Adv. Rajeshwar Dayal is a designated Senior Advocate with over 28 years of practice in constitutional law, corporate arbitration, and public interest jurisprudence.',
  highlights: [],
  educationList: [],
  experienceList: [],
  achievementsList: [],
  newsList: [],
  featuredVideo: {
    title: 'The Constitution as India\'s Guiding Light',
    subtitle: 'National Law Day Address',
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  videoList: [],
  updates: [],
  gallery: [],
  communityStoriesCount: 28,
  communityStoriesList: [],
  likesCount: 7800,
  dislikesCount: 42,
};

// ============================================================================
// DR. SWETA GUPTA PROFILE (Doctors & Healthcare - IVF & Reproductive Medicine)
// ============================================================================
export const drSwetaGuptaProfile: PersonProfile = {
  id: 'BBN-PPL-SWETA-GUPTA-001',
  name: 'Dr. Sweta Gupta',
  slug: 'dr-sweta-gupta',
  role: 'Medical Director & Senior IVF Specialist | MBBS, MD, DNB, MRCOG (UK)',
  badge: 'Medical Leader',
  location: 'Sector 32, Noida, UP',
  quote: 'Compassionate reproductive care and international clinical excellence for every aspiring family.',
  avatarUrl: '/people/dr-sweta-gupta.png',
  coverUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  followersCount: 1680,
  followingCount: 22,
  postsCount: 42,
  viewsCount: '210K+',
  isVerified: true,
  website: 'https://drswetagupta.com/',
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  },
  aboutText:
    'Dr. Sweta Gupta is an internationally acclaimed reproductive medicine specialist and Medical Director of SG IVF Clinic Noida. With prestigious MRCOG (UK) credentials, fellowship training from premier NHS hospitals in the United Kingdom, and over 12,000+ successful IVF cycles, she is celebrated as the top fertility doctor in Delhi NCR.',
  highlights: [
    {
      key: 'education',
      icon: 'GraduationCap',
      title: 'Global Credentials',
      description: 'MBBS, MD, DNB, MRCOG (Royal College UK)',
    },
    {
      key: 'experience',
      icon: 'Briefcase',
      title: 'Clinical Mastery',
      description: '20+ Years & 12,000+ Successful IVF Cycles',
    },
    {
      key: 'achievements',
      icon: 'Trophy',
      title: 'Excellence in IVF',
      description: 'Pioneered Blastocyst Culture Protocols in NCR',
    },
    {
      key: 'compassion',
      icon: 'HeartHandshake',
      title: 'Ethical Care',
      description: 'Transparent & Personalized Reproductive Guidance',
    },
  ],
  educationList: [
    {
      id: 'sweta-edu-1',
      degree: 'MRCOG (Obstetrics & Gynaecology)',
      institution: 'Royal College of Obstetricians and Gynaecologists, United Kingdom',
      year: '2004',
      description: 'Gold-standard international specialist qualification in reproductive health.',
    },
    {
      id: 'sweta-edu-2',
      degree: 'Fellowship in Reproductive Medicine & IVF',
      institution: 'Premier NHS Foundation Teaching Hospitals, UK',
      year: '2006',
      description: 'Sub-specialization in advanced assisted reproduction, blastocyst transfer, and ICSI.',
    },
  ],
  experienceList: [
    {
      id: 'sweta-exp-1',
      role: 'Medical Director & Senior Fertility Specialist',
      organization: 'SG IVF Clinic, Sector 32 Wave City Centre, Noida',
      period: '2014 — Present',
      description: 'Leading a team of senior embryologists with clean-room class 10000 embryology laboratories.',
    },
  ],
  achievementsList: [
    {
      id: 'sweta-ach-1',
      title: 'Over 12,000+ Successful Cycles Completed',
      organization: 'Clinical Registry',
      year: '2024',
      description: 'Recognized for clinical integrity, patient-first care, and industry-leading success rates.',
    },
  ],
  newsList: [],
  featuredVideo: {
    title: 'Understanding IVF Success: Insights by Dr. Sweta Gupta',
    subtitle: 'Comprehensive Fertility Masterclass',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  },
  videoList: [],
  updates: [],
  gallery: [
    {
      url: '/people/dr-sweta-gupta.png',
      caption: 'Dr. Sweta Gupta — Medical Director & Senior IVF Specialist',
    },
  ],
  communityStoriesCount: 24,
  communityStoriesList: [],
  likesCount: 4200,
  dislikesCount: 16,
};

// ============================================================================
// DR. SANJAY GUPTA PROFILE (Doctors & Healthcare - Robotic Knee Specialist)
// ============================================================================
export const drSanjayGuptaProfile: PersonProfile = {
  id: 'BBN-PPL-SANJAY-GUPTA-001',
  name: 'Dr. Sanjay Gupta',
  slug: 'dr-sanjay-gupta',
  role: 'Chief Robotic Knee Replacement Surgeon | MS Orthopedics, MCh Orth (UK), FRCS',
  badge: 'Medical Leader',
  location: 'Sector 32, Noida, UP',
  quote: 'Global surgical excellence and robotic precision for painless, lasting joint mobility.',
  avatarUrl: '/people/dr-sanjay-gupta.png',
  coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  followersCount: 1420,
  followingCount: 18,
  postsCount: 36,
  viewsCount: '180K+',
  isVerified: true,
  website: 'https://drsanjaygupta.info/',
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  },
  aboutText:
    'Dr. Sanjay Gupta is a Gold Medalist in MS Orthopedics with premier international surgical training from both India and the United Kingdom (MCh Orth UK, FRCS Tr & Orth). With over two decades of surgical mastery and 2,000+ successful joint surgeries, he is recognized as the leading robotic knee replacement surgeon in Noida and Delhi NCR.',
  highlights: [
    {
      key: 'education',
      icon: 'GraduationCap',
      title: 'Education',
      description: 'Gold Medalist MS Orthopedics, MCh Orth (UK), FRCS (Tr & Orth)',
    },
    {
      key: 'experience',
      icon: 'Briefcase',
      title: 'Experience',
      description: '20+ Years Clinical Mastery & 2,000+ Joint Surgeries',
    },
    {
      key: 'achievements',
      icon: 'Trophy',
      title: 'Achievements',
      description: 'Golden Fellowships in Knee & Hip Replacement (UK)',
    },
    {
      key: 'robotic-tech',
      icon: 'Sparkles',
      title: 'Robotic Innovation',
      description: 'First Adopter of AI-Guided Robotic Knee Surgery in Noida',
    },
  ],
  educationList: [
    {
      id: 'sg-edu-1',
      degree: 'MS Orthopedics (Gold Medalist)',
      institution: 'Premier Apex Orthopedic Institute, India',
      year: '2001',
      description: 'Awarded University Gold Medal for highest academic and surgical clinical distinction.',
    },
    {
      id: 'sg-edu-2',
      degree: 'MCh Orth (Orthopedic Surgery)',
      institution: 'Premier University Teaching Hospitals, United Kingdom',
      year: '2006',
      description: 'Advanced joint biomechanics, sub-millimeter arthroplasty, and joint reconstruction.',
    },
    {
      id: 'sg-edu-3',
      degree: 'FRCS (Tr & Orth)',
      institution: 'Royal College of Surgeons, United Kingdom',
      year: '2008',
      description: 'Prestigious fellowship credential representing the highest standard in surgical practice.',
    },
  ],
  experienceList: [
    {
      id: 'sg-exp-1',
      role: 'Chief Robotic Joint Replacement Surgeon',
      organization: 'Dr. Sanjay Gupta Orthopedic Clinic & Robotic Surgery Suite, Sector 32 Noida',
      period: '2012 — Present',
      description: 'Pioneered 3D CT-guided robotic knee replacements with rapid day-1 mobilization protocols.',
    },
    {
      id: 'sg-exp-2',
      role: 'Senior Orthopedic Consultant & Joint Fellow',
      organization: 'National Health Service (NHS) Trust Teaching Hospitals, United Kingdom',
      period: '2005 — 2012',
      description: 'Specialized in complex revision joint reconstructions and athletic sports trauma care.',
    },
  ],
  achievementsList: [
    {
      id: 'sg-ach-1',
      title: 'Over 2,000+ Successful Joint Replacements',
      organization: 'Clinical Registry',
      year: '2024',
      description: 'Remarkable clinical safety record with near-zero complications and rapid pain relief.',
    },
    {
      id: 'sg-ach-2',
      title: 'UK Golden Fellowships in Knee & Hip Surgery',
      organization: 'British Orthopedic Association & Royal College',
      year: '2009',
      description: 'Recognized for advanced surgical precision and minimally invasive arthroplasty.',
    },
  ],
  newsList: [],
  featuredVideo: {
    title: 'How Robotic Knee Replacement Restores Painless Walking in 48 Hours',
    subtitle: 'Clinical Masterclass by Dr. Sanjay Gupta',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  },
  videoList: [],
  updates: [],
  gallery: [
    {
      url: '/people/dr-sanjay-gupta.png',
      caption: 'Dr. Sanjay Gupta — Gold Medalist in MS Orthopedics, MCh Orth (UK), FRCS (Tr & Orth)',
    },
  ],
  communityStoriesCount: 18,
  communityStoriesList: [],
  likesCount: 3200,
  dislikesCount: 14,
};

export const peopleDatabase: Record<string, PersonProfile> = {
  'dr-sweta-gupta': drSwetaGuptaProfile,
  'sweta-gupta': drSwetaGuptaProfile,
  'drswetagupta': drSwetaGuptaProfile,
  'dr-sanjay-gupta': drSanjayGuptaProfile,
  'sanjay-gupta': drSanjayGuptaProfile,
  'drsanjaygupta': drSanjayGuptaProfile,
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
  'dr-priya-sharma': drPriyaSharmaProfile,
  'prof-rakesh-verma': profRakeshVermaProfile,
  'dr-meenakshi-iyer': drMeenakshiIyerProfile,
  'adv-rajeshwar-dayal': advRajeshwarDayalProfile,
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
    followersCount: 0,
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
