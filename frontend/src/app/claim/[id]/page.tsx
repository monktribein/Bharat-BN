'use client';

import { useState, useRef, use, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ArrowLeft,
  Loader2,
  Building2,
  Image as ImageIcon,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Plus,
  ExternalLink,
  Sparkles,
  Award,
  User,
  Star,
  Camera,
  RotateCcw,
  LogOut,
  Edit,
  Trash2,
} from 'lucide-react';

export default function ClaimBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryUploadInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // PRESET DATA DEFINITIONS
  // ==========================================
  const presetsData = {
    choco: {
      name: 'Choco Delights & Confectionery (Cadboury)',
      logo: '/choco-logo.svg',
      logoFileName: 'choco-logo.svg',
      category: 'Food, Bakeries & Confectionery',
      subCategories: 'Food & Dining, Bakeries & Confectionery, Artisan Chocolates, Corporate Gifting',
      establishedYear: '2018',
      addressLine: 'Shop 12, Crystal Plaza, New Link Road, Andheri West',
      landmark: 'Opposite Infiniti Mall / Metro Station',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      whatsapp: '+91 89653 26578',
      phone: '+91 89653 26578',
      email: 'contact@chocodelights.in',
      website: 'https://chocodelights.in',
      fullName: 'Choco Delights HQ Operations',
      ownerRole: 'Founder & Master Chocolatier',
      memberSince: 'Nov 2024',
      responseRate: '< 15 mins',
      cityRank: 'Top-3 Verified',
      description:
        'Choco Delights & Confectionery (Cadboury) is an audited premier confectionery brand in Andheri West, Mumbai. Certified for food safety standards, direct Belgian cocoa imports, and same-day temperature-controlled gift delivery across Mumbai.',
      aboutStory:
        'Founded in 2018 in Andheri West, Choco Delights & Confectionery has grown into one of Mumbai’s most sought-after boutique chocolate studios. We combine artisanal European chocolate tempering techniques with the freshest Indian ingredients. Each batch of truffles, pralines, and custom corporate hampers is handcrafted fresh daily under strict temperature and hygiene controls. Having delivered over 10,000+ gift boxes for corporate clients, weddings, and chocolate connoisseurs, our mission is to deliver pure, unadulterated confectionery perfection with 100% verified provenance.',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Handcrafted Belgian Dark Chocolate Truffles & Pralines',
        },
        {
          url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
          caption: 'Luxury Customized Corporate Gift Hampers & Festive Boxes',
        },
        {
          url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80',
          caption: 'Pure Cocoa Bean Selection & Artisanal Ganache Cones',
        },
        {
          url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
          caption: 'Choco Delights Flagship Studio — Crystal Plaza, Andheri West',
        },
      ],
      services: [
        'Artisan Dark Chocolates',
        'Belgian Cocoa Truffles',
        'Custom Corporate Hampers',
        'Dessert & Grazing Tables',
        'Sugar-Free & Vegan Truffles',
        'Same-Day Mumbai Delivery',
        'Personalized Wedding Favors',
        'Festive Gift Packaging',
      ],
      amenities: [
        'Air Conditioned Boutique',
        'Credit / Debit Cards & UPI',
        'Custom Corporate Invoicing',
        'Temperature-Controlled Van Delivery',
        'Gift Wrapping & Custom Notes',
        'FSSAI Certified Kitchen',
        'Wheelchair Accessible',
      ],
      monFriHours: '09:30 AM – 09:30 PM',
      satHours: '09:30 AM – 10:00 PM',
      sunHours: '10:00 AM – 08:30 PM',
      rating: '4.9',
      reviewsCount: '48',
      featuredReviewAuthor: 'Rohan Mehra',
      featuredReviewRating: 5,
      featuredReviewDate: '12 Nov 2026',
      featuredReviewComment:
        'Ordered 60 custom corporate Diwali hampers for our fintech firm. The packaging was royal, Belgian truffles melted in mouth, and delivery in Mumbai was right on time. Highly recommended!',
      docType: 'fssai_cert',
      docNumber: '27AABCC8491K1Z8',
    },
    apex: {
      name: 'Apex Super Speciality Dental Clinic',
      logo: '/apex-logo.svg',
      logoFileName: 'apex-logo.svg',
      category: 'Healthcare & Clinics',
      subCategories: 'Healthcare, Dental Clinics, Orthodontics & Invisalign, Dental Implants',
      establishedYear: '2014',
      addressLine: 'Shop 4, Greenfield Heights, Lokhandwala Complex, Andheri West',
      landmark: 'Near Lokhandwala Market Circle',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      whatsapp: '+91 98200 12345',
      phone: '+91 98200 12345',
      email: 'care@apexdentalmumbai.com',
      website: 'https://apexdentalmumbai.com',
      fullName: 'Dr. Rajesh Sharma',
      ownerRole: 'Clinical Director & Lead Endodontist',
      memberSince: 'Oct 2024',
      responseRate: '< 10 mins',
      cityRank: 'Top-3 Verified',
      description:
        'Apex Super Speciality Dental Clinic is an audited premier dental center in Andheri West, Mumbai. Equipped with 3D CBCT digital scans, certified orthodontists, and painless microscope-assisted endodontics.',
      aboutStory:
        'Apex Super Speciality Dental Clinic was established to bring world-class, painless, and technologically advanced dental healthcare to Andheri West, Mumbai. Led by senior dental surgeons and certified Invisalign specialists with over 15+ years of clinical excellence, our clinic maintains hospital-grade sterilization protocols. From subtle smile makeovers to complex dental implant surgeries, over 12,000+ satisfied patients trust Apex for ethical, transparent, and gentle dental care.',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
          caption: 'State-of-the-Art Digital Consultation & Operatory Suite',
        },
        {
          url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
          caption: 'Painless Microscope-Assisted Dental Operatory',
        },
        {
          url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80',
          caption: 'Low-Radiation 3D CBCT Digital Smile Scanning',
        },
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Patient Reception Lounge — Greenfield Heights, Lokhandwala',
        },
      ],
      services: [
        'Invisalign Clear Aligners',
        'Microscope Root Canal Treatment',
        'Laser Teeth Whitening',
        'Titanium Dental Implants',
        'Pediatric Gentle Dentistry',
        '24x7 Dental Trauma Emergency',
        'Digital Smile Designing (DSD)',
        'Full Mouth Rehabilitation',
      ],
      amenities: [
        '3D CBCT Low-Radiation Imaging',
        'German Sterilization Autoclaves',
        'Strict Infection-Control Protocols',
        'Private Operatory Rooms',
        'Cashless Insurance & EMI Support',
        'Valet Parking Available',
      ],
      monFriHours: '09:00 AM – 09:00 PM',
      satHours: '09:00 AM – 09:00 PM',
      sunHours: '10:00 AM – 02:00 PM (Emergency by appt)',
      rating: '4.9',
      reviewsCount: '124',
      featuredReviewAuthor: 'Kavita Nair',
      featuredReviewRating: 5,
      featuredReviewDate: '08 Nov 2026',
      featuredReviewComment:
        'Got my Invisalign treatment done here. Dr. Rajesh and team are exceptionally patient and gentle. The 3D simulation was spot on!',
      docType: 'gst_certificate',
      docNumber: '27AAACA1234F1Z5',
    },
    little_elly: {
      name: 'Little Elly International Preschool',
      logo: '/little-elly-logo.svg',
      logoFileName: 'little-elly-logo.svg',
      category: 'Preschools & Education',
      subCategories: 'Education, Preschools, Daycare Centers, Early Childhood Education',
      establishedYear: '2016',
      addressLine: '12th Main Road, HAL 2nd Stage, Indiranagar',
      landmark: 'Behind Indiranagar Club',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      whatsapp: '+91 98450 67890',
      phone: '+91 98450 67890',
      email: 'admissions@littleellyindiranagar.com',
      website: 'https://littleelly.com',
      fullName: 'Sunita Rao',
      ownerRole: 'Centre Director & Academic Head',
      memberSince: 'Aug 2024',
      responseRate: '< 20 mins',
      cityRank: '#1 in Indiranagar',
      description:
        'Little Elly Indiranagar center offers international early childhood education curriculum with safe child-first infrastructure and CCTV-enabled classrooms.',
      aboutStory:
        'Little Elly Indiranagar is committed to nurturing children aged 1.5 to 6 years through play-way and experiential learning. Surrounded by quiet green foliage in Indiranagar, Bengaluru, our campus offers large open classrooms, certified early-years educators, and safe, hygienic facilities designed to inspire curiosity and joyful learning.',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Green Campus & Safe Children Entrance — Indiranagar',
        },
        {
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Bright Activity Classrooms with Child-Safe Furniture',
        },
        {
          url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
          caption: 'Sensory Play Stations & Certified Early Education Aids',
        },
        {
          url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
          caption: 'Reading Nook & Storytelling Circles',
        },
      ],
      services: [
        'Toddler Early Sensory Play',
        'Pre-Kindergarten Curriculum',
        'Full-Day Premium Daycare',
        'CCTV Live Parent Mobile Feed',
        'Nutritious In-House Meal Program',
        'Music & Movement Sensory Labs',
      ],
      amenities: [
        'Child-Safe Cushioned Flooring',
        '24x7 Security & Guarded Gate',
        'Air-Purified Classrooms',
        'Green Sandpit & Splash Pool',
        'Trained Female Support Staff',
        'Pediatric First Aid Certified',
      ],
      monFriHours: '08:30 AM – 06:30 PM',
      satHours: '09:00 AM – 01:00 PM (Admissions open)',
      sunHours: 'Closed',
      rating: '4.8',
      reviewsCount: '86',
      featuredReviewAuthor: 'Deepak Varma',
      featuredReviewRating: 5,
      featuredReviewDate: '10 Nov 2026',
      featuredReviewComment:
        'My daughter has been in toddler care for 8 months. Her communication and confidence have flourished. Teachers are loving and CCTV feed gives peace of mind.',
      docType: 'official_id',
      docNumber: '29AABTL9982M1Z0',
    },
    tech: {
      name: 'NexaByte Software & Cloud Labs',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      logoFileName: 'nexabyte-logo.png',
      category: 'IT, Software & Technology',
      subCategories: 'Custom Software Development, Web & Mobile Apps, Cloud Architecture, DevOps & Cybersecurity',
      establishedYear: '2021',
      addressLine: '4th Floor, Tech Park One, Outer Ring Road, Bellandur',
      landmark: 'Near EcoSpace Tech Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      whatsapp: '+91 98860 54321',
      phone: '+91 98860 54321',
      email: 'contact@nexabytesoftware.com',
      website: 'https://nexabytesoftware.com',
      fullName: 'Vikramaditya Rao',
      ownerRole: 'Chief Technology Officer & Managing Director',
      memberSince: 'Jan 2024',
      responseRate: '< 10 mins',
      cityRank: 'Top-3 Verified Tech Firm',
      description:
        'NexaByte Software & Cloud Labs is an audited technology development firm in Bengaluru. Specializing in custom enterprise software, scalable web & mobile apps, cloud migrations, and dedicated engineering teams for Indian businesses.',
      aboutStory:
        'Founded in 2021 in Bengaluru, NexaByte Software & Cloud Labs has delivered mission-critical software architectures, modern web & mobile platforms, and enterprise digital solutions for growing companies across India. Our certified in-house engineering team focuses on clean code, secure cloud deployments on AWS and Azure, and agile delivery. With over 80+ successful software projects and a 99.8% client satisfaction rate, we partner with businesses to scale their technology seamlessly.',
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Modern Engineering Workspace & Collaborative Tech Labs',
        },
        {
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Agile Product Sprint & Architecture Review Sessions',
        },
        {
          url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
          caption: 'High-Performance UI/UX Design & Prototyping Lab',
        },
        {
          url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Secure Cloud DevOps & 24/7 Production Monitoring Desk',
        },
      ],
      services: [
        'Custom Web Application Development',
        'iOS & Android Mobile App Engineering',
        'Cloud Architecture & AWS/Azure Migration',
        'UI/UX Product Design & Wireframing',
        'Enterprise ERP & CRM Integration',
        'Cybersecurity & Source Code Audits',
        'Dedicated Developer Pods & Staff Augmentation',
        'API Design & Microservices Architecture',
      ],
      amenities: [
        'High-Speed Dedicated Fiber Internet',
        '24x7 Power Backup & Server Room',
        'Client Conference & Video Pods',
        'ISO 27001 Certified Security Standards',
        'NDA & IP Rights Protection Guaranteed',
        'Official GST Invoicing',
        'Visitor Parking Available',
      ],
      monFriHours: '09:00 AM – 07:00 PM',
      satHours: '10:00 AM – 02:00 PM (By Appointment)',
      sunHours: 'Closed',
      rating: '4.9',
      reviewsCount: '62',
      featuredReviewAuthor: 'Sunil Nair (Founder, LogiKart)',
      featuredReviewRating: 5,
      featuredReviewDate: '15 Oct 2026',
      featuredReviewComment:
        'NexaByte rebuilt our logistics dashboard and mobile driver app within 3 months. Their sprint discipline, clean architecture, and quick communication were outstanding. Production uptime has been 100%.',
      docType: 'gst_certificate',
      docNumber: '29AABCN4821P1Z5',
    },
  };

  // Clean Blank Gallery Template
  const blankGallery = [
    {
      url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Front Entrance & Building Elevation',
    },
    {
      url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
      caption: 'Core Products / Speciality Showcase',
    },
    {
      url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80',
      caption: 'Premises Interior & Workspace Area',
    },
    {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      caption: 'Customer Consultation & Reception Lounge',
    },
  ];

  // Standard Amenities List
  const standardAmenities = [
    'Air Conditioned Premises',
    'High-Speed Wi-Fi & Internet',
    'Credit / Debit Cards & UPI Accepted',
    'Official GST Invoicing',
    'Customer Parking Available',
    'Conference & Meeting Rooms',
    'Wheelchair Accessible',
    'Home / Doorstep Delivery',
    'Online Appointments & Booking',
    '24x7 Customer Support Hotline',
    'CCTV Monitored Premises',
    'Certified Professional Staff',
  ];

  // ==========================================
  // FORM STATE: STARTS CLEAN FOR NEW LISTING
  // ==========================================
  const [isEditing, setIsEditing] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [existingStatus, setExistingStatus] = useState<string>('pending');
  const [activeSession, setActiveSession] = useState<any>(null);

  // 1. Brand Identity
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Food, Bakeries & Confectionery');
  const [subCategories, setSubCategories] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoFileName, setLogoFileName] = useState<string>('');

  // 2. Physical Address & Location Standards (NAP)
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // 3. Direct Inquiries & Contact Channels
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // 4. Verified Owner & Credentials
  const [fullName, setFullName] = useState('');
  const [ownerRole, setOwnerRole] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [responseRate, setResponseRate] = useState('< 15 mins');
  const [cityRank, setCityRank] = useState('Top-3 Verified');

  // 5. About Us & Narrative Story
  const [description, setDescription] = useState('');
  const [aboutStory, setAboutStory] = useState('');

  // 6. Showcase Photography Gallery (Starts empty: Min 1, Max 5 uploaded by business)
  const [gallery, setGallery] = useState<{ url: string; caption: string }[]>([]);

  // 7. Key Offerings & Specialities Tags
  const [services, setServices] = useState<string[]>([]);
  const [newServiceTag, setNewServiceTag] = useState('');

  // 8. Premises Amenities & Standards
  const [amenities, setAmenities] = useState<string[]>([]);

  // 9. Operating Business Hours
  const [monFriHours, setMonFriHours] = useState('');
  const [satHours, setSatHours] = useState('');
  const [sunHours, setSunHours] = useState('');

  // 10. Customer Testimonials & Verified Reviews
  const [rating, setRating] = useState('5.0');
  const [reviewsCount, setReviewsCount] = useState('1');
  const [featuredReviewAuthor, setFeaturedReviewAuthor] = useState('');
  const [featuredReviewRating, setFeaturedReviewRating] = useState(5);
  const [featuredReviewDate, setFeaturedReviewDate] = useState('Recently');
  const [featuredReviewComment, setFeaturedReviewComment] = useState('');

  // 11. Document Verification Proof
  const [docType, setDocType] = useState('gst_certificate');
  const [docNumber, setDocNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form Submission & Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [claimTicket, setClaimTicket] = useState('');
  const [createdSlug, setCreatedSlug] = useState('');

  // ==========================================
  // INITIALIZATION & EDIT DETECTION
  // ==========================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if an owner session is active
    try {
      const storedSession = localStorage.getItem('bharatbn_owner_session');
      if (storedSession) {
        setActiveSession(JSON.parse(storedSession));
      }
    } catch {}

    // If ID is specified and not 'new', or if an existing business is targeted
    if (id && id !== 'new') {
      try {
        const storedClaims = localStorage.getItem('bharatbn_claims_store');
        if (storedClaims) {
          const claims = JSON.parse(storedClaims);
          const found = claims.find((c: any) => c.id === id || c.businessSlug === id);
          if (found) {
            setIsEditing(true);
            setExistingId(found.id);
            setExistingStatus(found.status || 'pending');
            setBusinessName(found.businessName || '');
            setCategory(found.category || 'Food, Bakeries & Confectionery');
            setSubCategories(
              Array.isArray(found.categoryHierarchy)
                ? found.categoryHierarchy.join(', ')
                : found.subCategories || ''
            );
            setEstablishedYear(found.establishedYear ? String(found.establishedYear) : '');
            setLogoPreview(found.logoBase64 || found.logoUrl || '');
            setLogoFileName(found.logoFileName || 'logo.png');
            setAddressLine(found.addressLine || '');
            setLandmark(found.landmark || '');
            setCity(found.city || '');
            setState(found.state || '');
            setPincode(found.pincode || '');
            setWhatsapp(found.whatsapp || '');
            setPhone(found.phone || '');
            setEmail(found.workEmail || found.email || '');
            setWebsite(found.website || '');
            setFullName(found.claimantName || found.fullName || '');
            setOwnerRole(found.ownerRole || '');
            setMemberSince(found.memberSince || '');
            setResponseRate(found.responseRate || '< 15 mins');
            setCityRank(found.cityRank || 'Top-3 Verified');
            setDescription(found.description || '');
            setAboutStory(found.aboutStory || '');
            if (found.gallery && found.gallery.length > 0) setGallery(found.gallery);
            if (found.services && found.services.length > 0) setServices(found.services);
            if (found.amenities && found.amenities.length > 0) setAmenities(found.amenities);
            if (found.workingHours && found.workingHours.length > 0) {
              setMonFriHours(found.workingHours[0]?.time || '');
              setSatHours(found.workingHours[1]?.time || '');
              setSunHours(found.workingHours[2]?.time || '');
            }
            setRating(found.rating ? String(found.rating) : '5.0');
            setReviewsCount(found.reviewsCount ? String(found.reviewsCount) : '1');
            if (found.reviews && found.reviews[0]) {
              setFeaturedReviewAuthor(found.reviews[0].author || '');
              setFeaturedReviewRating(found.reviews[0].rating || 5);
              setFeaturedReviewDate(found.reviews[0].date || 'Recently');
              setFeaturedReviewComment(found.reviews[0].comment || '');
            }
            setDocType(found.docType || 'gst_certificate');
            setDocNumber(found.gstin || found.docNumber || '');
          }
        }
      } catch (err) {
        console.error('Error loading existing business:', err);
      }
    }
  }, [id]);

  // ==========================================
  // RESET / CLEAR FORM TO EMPTY SLATE
  // ==========================================
  const clearForm = () => {
    setIsEditing(false);
    setExistingId(null);
    setBusinessName('');
    setCategory('Food, Bakeries & Confectionery');
    setSubCategories('');
    setEstablishedYear('');
    setLogoPreview('');
    setLogoFileName('');
    setAddressLine('');
    setLandmark('');
    setCity('');
    setState('');
    setPincode('');
    setWhatsapp('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setFullName('');
    setOwnerRole('');
    setMemberSince('');
    setResponseRate('< 15 mins');
    setCityRank('Top-3 Verified');
    setDescription('');
    setAboutStory('');
    setGallery([]);
    setServices([]);
    setAmenities([]);
    setMonFriHours('');
    setSatHours('');
    setSunHours('');
    setRating('5.0');
    setReviewsCount('1');
    setFeaturedReviewAuthor('');
    setFeaturedReviewComment('');
    setDocType('gst_certificate');
    setDocNumber('');
    setFile(null);
  };

  // ==========================================
  // PRESET SWITCHER FUNCTION
  // ==========================================
  const applyPreset = (key: 'choco' | 'apex' | 'little_elly' | 'tech') => {
    const p = presetsData[key];
    if (!p) return;
    setBusinessName(p.name);
    setLogoPreview(p.logo);
    setLogoFileName(p.logoFileName);
    setCategory(p.category);
    setSubCategories(p.subCategories);
    setEstablishedYear(p.establishedYear);
    setAddressLine(p.addressLine);
    setLandmark(p.landmark);
    setCity(p.city);
    setState(p.state);
    setPincode(p.pincode);
    setWhatsapp(p.whatsapp);
    setPhone(p.phone);
    setEmail(p.email);
    setWebsite(p.website);
    setFullName(p.fullName);
    setOwnerRole(p.ownerRole);
    setMemberSince(p.memberSince);
    setResponseRate(p.responseRate);
    setCityRank(p.cityRank);
    setDescription(p.description);
    setAboutStory(p.aboutStory);
    setGallery(p.gallery);
    setServices(p.services);
    setAmenities(p.amenities);
    setMonFriHours(p.monFriHours);
    setSatHours(p.satHours);
    setSunHours(p.sunHours);
    setRating(p.rating);
    setReviewsCount(p.reviewsCount);
    setFeaturedReviewAuthor(p.featuredReviewAuthor);
    setFeaturedReviewRating(p.featuredReviewRating);
    setFeaturedReviewDate(p.featuredReviewDate);
    setFeaturedReviewComment(p.featuredReviewComment);
    setDocType(p.docType);
    setDocNumber(p.docNumber);
  };

  // ==========================================
  // LOGOUT HANDLER
  // ==========================================
  const handleLogout = () => {
    try {
      localStorage.removeItem('bharatbn_owner_session');
      window.dispatchEvent(new Event('bharatbn_auth_changed'));
      setActiveSession(null);
      clearForm();
    } catch {}
  };

  // ==========================================
  // FILE & TAG HANDLERS
  // ==========================================
  // Logo Upload with Base64 Preview
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      alert('Logo file size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoPreview(reader.result);
        setLogoFileName(selected.name);
      }
    };
    reader.readAsDataURL(selected);
  };

  // Add new photos (Min 1, Max 5)
  const handleAddNewPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - gallery.length;
    if (remainingSlots <= 0) {
      alert('Maximum 5 showcase photos can be uploaded.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(`Only ${remainingSlots} photo(s) added (Maximum limit of 5 reached).`);
    }

    filesToProcess.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 5MB limit and was skipped.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setGallery((prev) => {
            if (prev.length >= 5) return prev;
            return [
              ...prev,
              {
                url: reader.result as string,
                caption: `Showcase Photo ${prev.length + 1}`,
              },
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Replace single photo
  const handleReplacePhoto = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = [...gallery];
        updated[index] = { ...updated[index], url: reader.result };
        setGallery(updated);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove photo
  const handleRemovePhoto = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle Tag Addition
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newServiceTag.trim()) return;
    if (!services.includes(newServiceTag.trim())) {
      setServices([...services, newServiceTag.trim()]);
    }
    setNewServiceTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setServices(services.filter((t) => t !== tagToRemove));
  };

  // Toggle Amenity
  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  // Document Upload Handlers
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;
    setFileError(null);

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setFileError('File size exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // ==========================================
  // FORM SUBMISSION (QUEUED FOR ADMIN APPROVAL)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (gallery.length < 1) {
      alert('Please upload at least 1 showcase photo for your business profile (Maximum 5).');
      return;
    }
    if (gallery.length > 5) {
      alert('You can upload a maximum of 5 showcase photos.');
      return;
    }

    setIsSubmitting(true);
    setFileError(null);

    try {
      const ticketId = existingId || `BBN-CLM-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate clean slug
      let generatedSlug = (businessName + '-' + (city || 'local'))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (!generatedSlug) {
        generatedSlug = `business-${ticketId.toLowerCase()}`;
      }

      const docTypeLabels: Record<string, string> = {
        gst_certificate: 'GST Registration Certificate',
        utility_bill: 'Commercial Electricity / Phone Bill',
        official_id: 'Govt Shop & Establishment License',
        fssai_cert: 'FSSAI Food Safety Certificate',
      };

      // Construct live listing object (Status is 'pending' until Admin Approves!)
      const claimItem = {
        id: ticketId,
        businessName: businessName.trim(),
        businessSlug: generatedSlug,
        logoBase64: logoPreview,
        logoUrl: logoPreview,
        city: city.trim(),
        state: state.trim(),
        addressLine: addressLine.trim(),
        landmark: landmark.trim(),
        pincode: pincode.trim(),
        category: category,
        categoryHierarchy: subCategories
          ? subCategories.split(',').map((s) => s.trim()).filter(Boolean)
          : [category, businessName.trim()],
        claimantName: fullName || 'Authorized Business Manager',
        ownerRole: ownerRole || 'Verified Business Owner',
        memberSince: memberSince || 'Nov 2024',
        responseRate: responseRate || '< 15 mins',
        cityRank: cityRank || 'Top-3 Verified',
        workEmail: email,
        phone: phone,
        whatsapp: whatsapp ? whatsapp.replace(/[^0-9]/g, '') : phone.replace(/[^0-9]/g, ''),
        website: website,
        description: description,
        aboutStory: aboutStory,
        establishedYear: Number(establishedYear) || 2024,
        services: services,
        amenities: amenities,
        gallery: gallery,
        workingHours: [
          { days: 'Monday – Friday', time: monFriHours || '09:30 AM – 08:30 PM', isOpenNow: true },
          { days: 'Saturday', time: satHours || '09:30 AM – 08:30 PM', isOpenNow: true },
          { days: 'Sunday', time: sunHours || 'Closed', isOpenNow: false },
        ],
        rating: Number(rating) || 5.0,
        reviewsCount: Number(reviewsCount) || 1,
        reviews: featuredReviewAuthor
          ? [
              {
                id: `rev-${Date.now()}-1`,
                author: featuredReviewAuthor,
                rating: Number(featuredReviewRating) || 5,
                date: featuredReviewDate || 'Recently',
                comment:
                  featuredReviewComment ||
                  'Prompt response, authentic service, and verified business standards.',
                verified: true,
              },
            ]
          : [],
        gstin: docNumber || '27AABCC' + Math.floor(1000 + Math.random() * 9000) + 'K1Z8',
        gstinMatch: 98,
        docType: docTypeLabels[docType] || 'Official Proof Document',
        fileName: file ? file.name : 'Registration_Proof_Certificate.pdf',
        fileSize: file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.2 MB',
        submittedAt: 'Just now (Recently Submitted)',
        status: isEditing ? existingStatus : 'pending', // PENDING ADMIN APPROVAL
      };

      // Persist to localStorage claims store
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bharatbn_claims_store');
        const existing = stored ? JSON.parse(stored) : [];
        const filtered = existing.filter((c: any) => c.id !== ticketId && c.businessSlug !== generatedSlug);
        localStorage.setItem('bharatbn_claims_store', JSON.stringify([claimItem, ...filtered]));

        // Persist Owner Session so user stays logged in to manage this business
        const ownerSession = {
          businessId: ticketId,
          businessName: claimItem.businessName,
          businessSlug: claimItem.businessSlug,
          ownerName: claimItem.claimantName,
          ownerEmail: claimItem.workEmail,
          logoUrl: claimItem.logoUrl || claimItem.logoBase64,
          status: claimItem.status,
        };
        localStorage.setItem('bharatbn_owner_session', JSON.stringify(ownerSession));

        // Notify entire app of auth & listings update
        window.dispatchEvent(new Event('bharatbn_claims_updated'));
        window.dispatchEvent(new Event('bharatbn_auth_changed'));
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      setClaimTicket(ticketId);
      setCreatedSlug(generatedSlug);
      setSubmitted(true);
    } catch {
      setFileError('Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // SUCCESS CONFIRMATION SCREEN
  // ==========================================
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ✦ Ticket ID: {claimTicket} &bull; Verification in Progress
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
            {isEditing ? 'Business Profile Updated!' : 'Business Profile Submitted Successfully!'}
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your brand details, address, contact numbers, and verification documents have been received. Standard verification takes 12–24 hours.
          </p>
        </div>

        {/* Live Preview Summary Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            {logoPreview ? (
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2 flex items-center justify-center flex-shrink-0">
                <img src={logoPreview} alt={businessName} className="w-full h-full object-contain rounded-xl" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#07213A] text-white font-mono font-bold text-2xl flex items-center justify-center flex-shrink-0">
                {businessName ? businessName.slice(0, 2).toUpperCase() : 'BN'}
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ⏳ Under Verification
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {claimTicket}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-900 truncate">
                {businessName}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                <span className="truncate">{addressLine}, {city}, {state} – {pincode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Owner Account</span>
              <div className="font-bold text-slate-800">{fullName} ({ownerRole || 'Owner'})</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Direct WhatsApp Channel</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>{whatsapp || phone}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Core Category</span>
              <div className="font-bold text-slate-800">{category}</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Showcase Gallery</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>{gallery.length} High-Res Slides Configured</span>
              </div>
            </div>
          </div>

          {/* Action CTAs for Business Owner */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/biz/${createdSlug}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#F95700] hover:bg-[#e04e00] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-[#F95700]/25 transition cursor-pointer"
            >
              <span>View Business Profile</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-5 py-3.5 rounded-xl transition cursor-pointer"
            >
              <Edit className="w-4 h-4 text-slate-600" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs px-5 py-3.5 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout &amp; List New Business</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN ONBOARDING FORM
  // ==========================================
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Active Owner Session Bar (If logged in) */}
        {activeSession && (
          <div className="bg-white border border-slate-200 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Currently logged in as:</span>
              <span className="font-extrabold text-slate-900">{activeSession.businessName}</span>
              <span className="text-[11px] text-slate-400">({activeSession.ownerName})</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/biz/${activeSession.businessSlug}`}
                className="text-xs font-semibold text-[#F95700] hover:underline"
              >
                View Profile ↗
              </Link>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout (List New Business)</span>
              </button>
            </div>
          </div>
        )}

        {/* Header Breadcrumbs */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-navy-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </Link>

          {/* <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F95700] bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            {isEditing ? '✦ Edit Business Profile' : '✦ List Business (Admin Moderation Desk)'}
          </div> */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-navy-900 tracking-tight">
                {isEditing ? `Edit Profile: ${businessName || 'Your Business'}` : 'List Your Business & Build Profile'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mt-1">
                Enter your business details below. Once submitted, your profile will be queued for admin verification before appearing as verified on the directory.
              </p>
            </div>

            {/* Clear Form / Reset Button */}
            <button
              type="button"
              onClick={clearForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition self-start sm:self-auto cursor-pointer shadow-xs"
              title="Clear all fields to start fresh"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ======================================================== */}
          {/* SECTION 1: Brand Identity & Real Logo */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F95700]" />
                <h2 className="text-base font-black text-navy-900">
                  1. Official Brand Identity &amp; Logo
                </h2>
              </div>
            </div>

            {/* Compact Brand Logo & Quick Presets Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-white p-1 shadow-xs flex-shrink-0 flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-2.5 py-1 bg-[#07213A] hover:bg-[#0c2a49] text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                  >
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <span className="text-[11px] text-slate-400">PNG, SVG, JPG (max 5MB)</span>
                </div>
              </div>

              {/* Optional Quick Preset Templates */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-0.5">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('choco')}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  title="1-Click template: Choco Delights"
                >
                  🍫 Choco Seal
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('apex')}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  title="1-Click template: Apex Dental Clinic"
                >
                  🏥 Apex Shield
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('little_elly')}
                  className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  title="1-Click template: Little Elly Preschool"
                >
                  🎓 Little Elly
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('tech')}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  title="1-Click template: NexaByte IT & Software"
                >
                  💻 NexaByte IT
                </button>
              </div>
            </div>

            {/* Business Identity Fields in Clean Balanced Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business / Enterprise Name <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name (e.g. Metro Multispeciality Clinic, NexaByte IT Labs)"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/10 transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Industry Category <span className="text-[#F95700]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white cursor-pointer font-medium text-slate-800"
                >
                  <option value="IT, Software & Technology">IT, Software &amp; Technology</option>
                  <option value="Healthcare & Clinics">Healthcare &amp; Clinics</option>
                  <option value="Education, Schools & Coaching">Education, Schools &amp; Coaching</option>
                  <option value="Food, Bakeries & Cafes">Food, Bakeries &amp; Cafes</option>
                  <option value="Restaurants & Cloud Kitchens">Restaurants &amp; Cloud Kitchens</option>
                  <option value="Automobile, EV & Repair Services">Automobile, EV &amp; Repair Services</option>
                  <option value="Real Estate, Builders & Architects">Real Estate, Builders &amp; Architects</option>
                  <option value="Chartered Accountants, Tax & Legal">Chartered Accountants, Tax &amp; Legal</option>
                  <option value="Manufacturing, Industrial & Wholesale">Manufacturing, Industrial &amp; Wholesale</option>
                  <option value="Retail, Supermarkets & Shopping">Retail, Supermarkets &amp; Shopping</option>
                  <option value="Digital Marketing, Media & Printing">Digital Marketing, Media &amp; Printing</option>
                  <option value="Beauty, Salons & Wellness Spas">Beauty, Salons &amp; Wellness Spas</option>
                  <option value="Home Services, Electrical & Plumbing">Home Services, Electrical &amp; Plumbing</option>
                  <option value="Logistics, Transporters & Movers">Logistics, Transporters &amp; Movers</option>
                  <option value="Events, Weddings & Catering">Events, Weddings &amp; Catering</option>
                  <option value="Financial Services, Loans & Insurance">Financial Services, Loans &amp; Insurance</option>
                  <option value="Hotels, Resorts & Travel Agencies">Hotels, Resorts &amp; Travel Agencies</option>
                  <option value="Security & Facility Management">Security &amp; Facility Management</option>
                  <option value="Professional & Corporate Services">Professional &amp; Corporate Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Year Established
                </label>
                <input
                  type="number"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  placeholder="e.g. 2020"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sub-Categories &amp; Business Specialties (Comma-separated)
                </label>
                <input
                  type="text"
                  value={subCategories}
                  onChange={(e) => setSubCategories(e.target.value)}
                  placeholder="e.g. Web Development, Cloud Services, Mobile Apps, IT Consulting (or Dental Care, Orthodontics, Root Canal)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  These appear as business specialty tags directly below your business name on the public profile.
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: Business Address & Location */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <MapPin className="w-5 h-5 text-[#F95700]" />
              <h2 className="text-base font-black text-navy-900">
                2. Business Address &amp; Location
              </h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Street Address (Shop / Office / Building / Road) <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Shop 4, Ground Floor, Central Commercial Complex (or 4th Floor, Tech Park One)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prominent Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Metro Station / Tech Park"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City <span className="text-[#F95700]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Bengaluru, Delhi NCR, Pune"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State <span className="text-[#F95700]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra, Karnataka, Delhi"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pincode <span className="text-[#F95700]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 400053 or 560103"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: Contact & Direct Inquiries */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-navy-900">
                3. Contact &amp; Direct Inquiries
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Direct Inquiry Number <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +91 98200 12345"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Powers the one-click green WhatsApp inquiry button on your live profile.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Phone / Mobile Number <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98200 12345"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Displayed with a [Reveal] button on your profile to protect from spam calls.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Work Email <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@yourbusiness.in"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Website URL
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://yourbusiness.in"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: Business Owner / Representative Details */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-black text-navy-900">
                4. Business Owner / Representative Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorized Owner / Manager Name <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Owner Designation / Role
                </label>
                <input
                  type="text"
                  value={ownerRole}
                  onChange={(e) => setOwnerRole(e.target.value)}
                  placeholder="e.g. Clinical Director / Founder"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Member Since Date
                </label>
                <input
                  type="text"
                  value={memberSince}
                  onChange={(e) => setMemberSince(e.target.value)}
                  placeholder="e.g. Nov 2024"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Average Customer Response Time
                </label>
                <select
                  value={responseRate}
                  onChange={(e) => setResponseRate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white cursor-pointer"
                >
                  <option value="< 10 mins">&lt; 10 mins (Immediate response)</option>
                  <option value="< 15 mins">&lt; 15 mins (Fast reply)</option>
                  <option value="< 30 mins">&lt; 30 mins</option>
                  <option value="Within 1 hour">Within 1 hour</option>
                  <option value="Within 24 hours">Within 24 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profile Recognition Tag
                </label>
                <input
                  type="text"
                  value={cityRank}
                  onChange={(e) => setCityRank(e.target.value)}
                  placeholder="e.g. Verified Business, Top Rated, Trusted Partner"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 5: Showcase Photography Gallery (Min 1, Max 5)   */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-black text-navy-900">
                  5. Showcase Photography (Min 1, Max 5 Photos)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    gallery.length >= 1
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {gallery.length >= 1 ? `✓ ${gallery.length} of 5 Photos` : 'Min 1 Photo Required'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Upload between 1 and 5 real photos of your business (storefront, clinic, interiors, products, or service setups). These photos form the full-width interactive slider on your live profile.
            </p>

            {/* Hidden file input for adding new photos */}
            <input
              ref={galleryUploadInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleAddNewPhotos}
            />

            {/* Empty State: Only shown when no photos have been uploaded */}
            {gallery.length === 0 ? (
              <div
                onClick={() => galleryUploadInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#F95700] hover:bg-orange-50/30 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition group"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto group-hover:scale-105 transition shadow-xs">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Upload Your Showcase Photos
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click to browse and upload photos from your device (Minimum 1, Maximum 5).
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#07213A] hover:bg-[#0c2a49] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Choose Photos (Min 1, Max 5)</span>
                </button>
                <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB each</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {gallery.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 space-y-2.5 relative group"
                    >
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-200 relative">
                        <img
                          src={item.url}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Photo {idx + 1}
                        </span>

                        {/* Remove / Delete Photo Button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition shadow-xs cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Photo {idx + 1} Caption
                        </label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => {
                            const updated = [...gallery];
                            updated[idx].caption = e.target.value;
                            setGallery(updated);
                          }}
                          placeholder={`Caption for Photo ${idx + 1}`}
                          className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#F95700]"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Another Photo Button (if < 5) */}
                  {gallery.length < 5 && (
                    <div
                      onClick={() => galleryUploadInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-[#F95700] hover:bg-orange-50/40 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition min-h-[190px] group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center group-hover:scale-105 transition">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        + Add Another Photo
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {gallery.length} of 5 added (up to {5 - gallery.length} more)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    ✦ Uploaded photos will be presented in an interactive full-width slider on your live profile.
                  </span>
                  {gallery.length < 5 && (
                    <button
                      type="button"
                      onClick={() => galleryUploadInputRef.current?.click()}
                      className="text-[#F95700] font-bold hover:underline cursor-pointer"
                    >
                      + Add Photo ({gallery.length}/5)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SECTION 6: About Us & Business Narrative */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-black text-navy-900">
                6. About Us &amp; Business Narrative Story
              </h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Headline Summary (1-2 sentences) <span className="text-[#F95700]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Premier healthcare clinic in Andheri West providing modern dental solutions..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Brand Story &amp; Craft Narrative <span className="text-[#F95700]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={aboutStory}
                  onChange={(e) => setAboutStory(e.target.value)}
                  placeholder="Share your founding story, background, values, mission, and what makes your business unique..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition bg-white"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 7: Key Offerings & Specialities */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-black text-navy-900">
                7. Products, Services &amp; Key Specialities
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServiceTag}
                  onChange={(e) => setNewServiceTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type an offering (e.g. Digital Consultations) and press Enter or Click Add"
                  className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#07213A] hover:bg-[#0c2a49] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {services.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full transition"
                  >
                    <span>✓ {tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-red-500 transition ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {services.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No tags added yet. Type an offering above to add.</span>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 8: Premises Amenities & Facilities */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-navy-900">
                8. Premises Amenities &amp; Quality Standards
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {standardAmenities.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-emerald-300 bg-emerald-50/60 text-slate-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 9: Operating Hours & Timings */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Clock className="w-5 h-5 text-[#F95700]" />
              <h2 className="text-base font-black text-navy-900">
                9. Operating Business Hours &amp; Timings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monday – Friday Hours
                </label>
                <input
                  type="text"
                  value={monFriHours}
                  onChange={(e) => setMonFriHours(e.target.value)}
                  placeholder="e.g. 09:30 AM – 09:30 PM"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saturday Hours
                </label>
                <input
                  type="text"
                  value={satHours}
                  onChange={(e) => setSatHours(e.target.value)}
                  placeholder="e.g. 09:30 AM – 10:00 PM"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sunday Hours
                </label>
                <input
                  type="text"
                  value={sunHours}
                  onChange={(e) => setSunHours(e.target.value)}
                  placeholder="e.g. 10:00 AM – 08:30 PM (or Closed)"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 10: Customer Reviews & Ratings */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <h2 className="text-base font-black text-navy-900">
                  10. Customer Reviews &amp; Testimonials
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <span>★ {rating} / 5.0</span>
                <span className="text-slate-400">({reviewsCount} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Reviews Count
                </label>
                <input
                  type="number"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Featured Reviewer Name
                </label>
                <input
                  type="text"
                  value={featuredReviewAuthor}
                  onChange={(e) => setFeaturedReviewAuthor(e.target.value)}
                  placeholder="e.g. Rohan Mehra"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Featured Customer Review Comment
                </label>
                <textarea
                  rows={2}
                  value={featuredReviewComment}
                  onChange={(e) => setFeaturedReviewComment(e.target.value)}
                  placeholder="Enter a genuine customer testimonial (e.g. Prompt service, great response on WhatsApp)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 11: Government Proof & Verification */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <FileText className="w-5 h-5 text-[#F95700]" />
              <h2 className="text-base font-black text-navy-900">
                11. Government Verification Proof (Audited Badge)
              </h2>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verification Document Type <span className="text-[#F95700]">*</span>
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white cursor-pointer"
                  >
                    <option value="gst_certificate">GST Registration Certificate (GSTIN Match)</option>
                    <option value="udyam_cert">Udyam MSME Registration Certificate (Govt of India)</option>
                    <option value="mca_incorp">MCA Certificate of Incorporation (CIN / LLPIN)</option>
                    <option value="official_id">Shop &amp; Establishment License (Gumasta / Trade License)</option>
                    <option value="utility_bill">Commercial Electricity / Phone Bill</option>
                    <option value="fssai_cert">FSSAI Food Safety License / Board Certificate</option>
                    <option value="prof_license">Professional Council Certificate (Medical, Bar, ICAI)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration / Certificate Number
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="e.g. 27AABCC8491K1Z8"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white"
                  />
                </div>
              </div>

              {/* Working File Upload Area */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />

                {!file ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center space-y-2 cursor-pointer transition ${
                      isDragging
                        ? 'border-[#F95700] bg-orange-50/70 scale-[0.99]'
                        : 'border-slate-300 hover:border-[#F95700] hover:bg-slate-50/60 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-[#F95700]">Click to upload document</span> or drag &amp; drop
                    </div>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 10MB (Stored securely in encrypted format)</p>
                  </div>
                ) : (
                  <div className="border border-orange-200 bg-orange-50/40 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F95700] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-navy-900 truncate max-w-[200px] sm:max-w-xs">
                          {file.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for verification
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#F95700] to-[#E04E00] hover:from-[#E04E00] hover:to-[#C94300] text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-[#F95700]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Listing to Admin Moderation Desk...</span>
                </>
              ) : (
                <>
                  <span>{isEditing ? 'Save & Update Business Profile' : 'Submit Business for Admin Approval'}</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Listing your business is 100% free. Admin verification typically takes less than 24 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
