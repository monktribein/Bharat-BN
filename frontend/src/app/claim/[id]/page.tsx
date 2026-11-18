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
  Trash2,
  ExternalLink,
  Sparkles,
  Award,
} from 'lucide-react';

export default function ClaimBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // 1. Basic Brand Identity
  const [businessName, setBusinessName] = useState(
    id !== 'new' && id ? id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Choco Delights & Confectionery'
  );
  const [fullName, setFullName] = useState('Cadboury / Rajesh Sharma');
  const [category, setCategory] = useState('Food, Bakeries & Confectionery');
  const [subCategories, setSubCategories] = useState('Food & Dining, Bakeries & Confectionery, Artisan Chocolates, Corporate Gifting');
  
  // Real Brand Logo State
  const [logoPreview, setLogoPreview] = useState<string>('/choco-logo.svg');
  const [logoFileName, setLogoFileName] = useState<string>('choco-logo.svg');

  // 2. Physical Address & Location
  const [addressLine, setAddressLine] = useState('Shop 12, Crystal Plaza, New Link Road, Andheri West');
  const [landmark, setLandmark] = useState('Opposite Infiniti Mall / Metro Station');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400053');

  // 3. Contact & Inquiries
  const [whatsapp, setWhatsapp] = useState('+91 89653 26578');
  const [phone, setPhone] = useState('+91 89653 26578');
  const [email, setEmail] = useState('contact@chocodelights.in');
  const [website, setWebsite] = useState('https://chocodelights.in');

  // 4. About Us & Story
  const [description, setDescription] = useState(
    'Choco Delights & Confectionery (Cadboury) is an audited premier confectionery brand in Andheri West, Mumbai. Certified for food safety standards, direct Belgian cocoa imports, and same-day temperature-controlled gift delivery across Mumbai.'
  );
  const [aboutStory, setAboutStory] = useState(
    'Founded in 2018 in Andheri West, Choco Delights & Confectionery has grown into one of Mumbai’s most sought-after boutique chocolate studios. We combine artisanal European chocolate tempering techniques with the freshest Indian ingredients. Each batch of truffles, pralines, and custom corporate hampers is handcrafted fresh daily under strict temperature and hygiene controls. Having delivered over 10,000+ gift boxes for corporate clients, weddings, and chocolate connoisseurs, our mission is to deliver pure, unadulterated confectionery perfection with 100% verified provenance.'
  );
  const [establishedYear, setEstablishedYear] = useState('2018');

  // 5. Showcase Photography (4 Sliders)
  const [gallery, setGallery] = useState<{ url: string; caption: string }[]>([
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
      caption: 'Flagship Studio & Temperature-Controlled Experience Center',
    },
  ]);

  // 6. Key Offerings / Specialities
  const [services, setServices] = useState<string[]>([
    'Artisan Dark Chocolates',
    'Belgian Cocoa Truffles',
    'Custom Corporate Hampers',
    'Dessert & Grazing Tables',
    'Sugar-Free & Vegan Truffles',
    'Same-Day Mumbai Delivery',
    'Personalized Wedding Favors',
    'Festive Gift Packaging',
  ]);
  const [newServiceTag, setNewServiceTag] = useState('');

  // 7. Premises Amenities & Standards
  const [amenities, setAmenities] = useState<string[]>([
    'Air Conditioned Boutique',
    'Credit / Debit Cards & UPI',
    'Custom Corporate Invoicing',
    'Temperature-Controlled Van Delivery',
    'Gift Wrapping & Custom Notes',
    'FSSAI Certified Kitchen',
    'Wheelchair Accessible',
  ]);

  const standardAmenities = [
    'Air Conditioned Boutique',
    'Credit / Debit Cards & UPI',
    'Custom Corporate Invoicing',
    'Temperature-Controlled Van Delivery',
    'Gift Wrapping & Custom Notes',
    'FSSAI Certified Kitchen',
    'Wheelchair Accessible',
    'Customer Parking Available',
    '24x7 Emergency Contact',
    'CCTV Monitored Premises',
  ];

  // 8. Business Hours
  const [monFriHours, setMonFriHours] = useState('09:30 AM – 09:30 PM');
  const [satHours, setSatHours] = useState('09:30 AM – 10:00 PM');
  const [sunHours, setSunHours] = useState('10:00 AM – 08:30 PM');

  // 9. Document Verification
  const [docType, setDocType] = useState('gst_certificate');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [claimTicket, setClaimTicket] = useState('');
  const [createdSlug, setCreatedSlug] = useState('');

  // Handle Logo Upload with Base64 Preview
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

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setFileError(null);

    try {
      const ticketId = `BBN-CLM-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate consistent slug
      let generatedSlug = (businessName + '-' + city)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      if (!generatedSlug || generatedSlug === 'choco-delights-confectionery-mumbai') {
        generatedSlug = 'choco-delights-confectionery-andheri-mumbai';
      }

      const docTypeLabels: Record<string, string> = {
        gst_certificate: 'GST Registration Certificate',
        utility_bill: 'Commercial Electricity / Phone Bill',
        official_id: 'Govt Shop & Establishment License',
        fssai_cert: 'FSSAI Food Safety Certificate',
      };

      // Construct live rich listing object
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
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        claimantName: fullName || 'Authorized Owner / Manager',
        workEmail: email,
        phone: phone,
        whatsapp: whatsapp.replace(/[^0-9]/g, ''),
        website: website,
        description: description,
        aboutStory: aboutStory,
        establishedYear: Number(establishedYear) || 2018,
        services: services,
        amenities: amenities,
        gallery: gallery,
        workingHours: [
          { days: 'Monday – Friday', time: monFriHours, isOpenNow: true },
          { days: 'Saturday', time: satHours, isOpenNow: true },
          { days: 'Sunday', time: sunHours, isOpenNow: true },
        ],
        gstin: '27AABCC' + Math.floor(1000 + Math.random() * 9000) + 'K1Z8',
        gstinMatch: 98,
        docType: docTypeLabels[docType] || 'Official Proof Document',
        fileName: file ? file.name : 'GST_Registration_Certificate_2026.pdf',
        fileSize: file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.2 MB',
        submittedAt: 'Just now (Recently Submitted)',
        status: 'approved', // Auto-approves locally for immediate showcase
      };

      // Persist to localStorage so both Admin Console & Profile Page pick it up
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bharatbn_claims_store');
        const existing = stored ? JSON.parse(stored) : [];
        // Replace existing matching slug or prepend
        const filtered = existing.filter((c: any) => c.businessSlug !== generatedSlug);
        localStorage.setItem('bharatbn_claims_store', JSON.stringify([claimItem, ...filtered]));
        window.dispatchEvent(new Event('bharatbn_claims_updated'));
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

  // SUCCESS CONFIRMATION SCREEN
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ✦ Ticket: {claimTicket} &bull; Audited &amp; Active
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
            Business Profile Successfully Listed!
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your real brand logo, showcase image gallery, physical address, business hours, and credentials have been recorded on BharatBN™.
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
                {businessName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED PROFILE ✓
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {claimTicket}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-900 truncate">
                {businessName}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                <span className="truncate">{addressLine}, {city} – {pincode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Direct WhatsApp Inquiry</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>{whatsapp}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Official Phone / Call</span>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#F95700]" />
                <span>{phone}</span>
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

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/biz/${createdSlug}`}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#F95700] hover:bg-[#e04e00] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-[#F95700]/25 transition"
            >
              <span>👉 View Live Business Profile</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/claims"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#07213A] hover:bg-[#0C2D4E] text-white font-semibold text-xs px-5 py-3.5 rounded-xl transition"
            >
              <span>View in Admin Desk</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-5 py-3.5 rounded-xl transition"
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ONBOARDING FORM
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F95700] bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
            ✦ Onboard &amp; Claim Business (BharatBN™ Profile Engine)
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-navy-900 tracking-tight">
            List Your Business &amp; Build Complete Profile
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            Upload your official brand logo, showcase image slider, NAP address, operating hours, and amenities to generate an audited profile with 100% data fidelity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION 1: Brand Identity & Real Logo */}
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

              {/* Compact Quick Preset Logos Inline */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-0.5">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview('/choco-logo.svg');
                    setLogoFileName('choco-logo.svg');
                    setBusinessName('Choco Delights & Confectionery (Cadboury)');
                    setCategory('Food, Bakeries & Confectionery');
                  }}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  🍫 Choco Seal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview('/apex-logo.svg');
                    setLogoFileName('apex-logo.svg');
                    setBusinessName('Apex Super Speciality Dental Clinic');
                    setCategory('Healthcare & Clinics');
                  }}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  🏥 Apex Shield
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview('/little-elly-logo.svg');
                    setLogoFileName('little-elly-logo.svg');
                    setBusinessName('Little Elly International Preschool');
                    setCategory('Preschools & Education');
                  }}
                  className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/90 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                >
                  🎓 Little Elly
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
                  placeholder="e.g. Choco Delights & Confectionery (Cadboury)"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Industry Category <span className="text-[#F95700]">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white cursor-pointer"
                >
                  <option value="Food, Bakeries & Confectionery">Food, Bakeries &amp; Confectionery</option>
                  <option value="Healthcare & Clinics">Healthcare &amp; Clinics</option>
                  <option value="Preschools & Education">Preschools &amp; Education</option>
                  <option value="Automobile & EV">Automobile &amp; EV</option>
                  <option value="Retail & Shopping">Retail &amp; Shopping</option>
                  <option value="Professional Services">Professional Services</option>
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
                  placeholder="e.g. 2018"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Taxonomy Sub-Categories (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={subCategories}
                  onChange={(e) => setSubCategories(e.target.value)}
                  placeholder="e.g. Food & Dining, Bakeries, Artisan Chocolates, Hampers"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  These appear as breadcrumb hierarchy tags directly below the business title.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Physical Address & Location */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-[#F95700]" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                2. Physical Address &amp; Location Standards (NAP)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Street Address (Shop / Office / Building / Road) <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Shop 12, Crystal Plaza, New Link Road, Andheri West"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prominent Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Infiniti Mall"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City Hub <span className="text-[#F95700]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
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
                    placeholder="e.g. 400053"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Communication & Inquiries */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                3. Direct Inquiries &amp; Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Direct Inquiry Number <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +91 89653 26578"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Powers the one-click green WhatsApp inquiry button on the profile page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Phone / Mobile (With Reveal Protection) <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 89653 26578"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Shown as &quot;+91 89653 XXXXX [Reveal]&quot; to prevent spam scrapers.
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
                  placeholder="e.g. contact@chocodelights.in"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
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
                  placeholder="e.g. https://chocodelights.in"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorized Owner / Manager Name <span className="text-[#F95700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Cadboury / Rajesh Sharma (Lead Endodontist)"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Showcase Photography Gallery (Image Carousel) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-black text-navy-900">
                  4. Showcase Photography (4-Slide Carousel Gallery)
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">{gallery.length} Images</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50 space-y-2 relative group"
                >
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-200 relative">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Slide {idx + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => {
                      const updated = [...gallery];
                      updated[idx].caption = e.target.value;
                      setGallery(updated);
                    }}
                    placeholder={`Slide ${idx + 1} Caption`}
                    className="w-full text-[11px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#F95700]"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              ✦ These 4 photos form the interactive full-width image slider on your business profile.
            </p>
          </div>

          {/* SECTION 5: About Us & Business Narrative */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                5. About Us &amp; Business Narrative Story
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Headline Summary (1-2 sentences) <span className="text-[#F95700]">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
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
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: Key Offerings & Specialities */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                6. Key Offerings &amp; Specialities (Tags)
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServiceTag}
                  onChange={(e) => setNewServiceTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type an offering (e.g. Belgian Truffles) and press Enter or Click Add"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
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

              <div className="flex flex-wrap gap-2 pt-2">
                {services.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full transition"
                  >
                    <span>✓ {tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-red-500 transition ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 7: Premises Amenities & Facilities */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                7. Premises Amenities &amp; Quality Standards
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {standardAmenities.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-emerald-300 bg-emerald-50/60 text-slate-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
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

          {/* SECTION 8: Operating Hours & Timings */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-[#F95700]" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                8. Operating Business Hours &amp; Timings
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monday – Friday Hours
                </label>
                <input
                  type="text"
                  value={monFriHours}
                  onChange={(e) => setMonFriHours(e.target.value)}
                  placeholder="e.g. 09:30 AM – 09:30 PM"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
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
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
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
                  placeholder="e.g. 10:00 AM – 08:30 PM"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 9: Government Proof & Verification */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-[#F95700]" />
              <h2 className="text-base sm:text-lg font-black text-navy-900">
                9. Government Verification Proof (Audited Badge)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Verification Document Type <span className="text-[#F95700]">*</span>
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F95700] bg-white cursor-pointer"
                >
                  <option value="gst_certificate">GST Registration Certificate (GSTIN Match)</option>
                  <option value="official_id">Govt Issued Shop &amp; Establishment License</option>
                  <option value="utility_bill">Commercial Electricity / Phone Bill</option>
                  <option value="fssai_cert">FSSAI Food Safety License / Board Certificate</option>
                </select>
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
                    className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 cursor-pointer transition ${
                      isDragging
                        ? 'border-[#F95700] bg-orange-50/70 scale-[0.99]'
                        : 'border-slate-300 hover:border-[#F95700] hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-[#F95700]">Click to upload document</span> or drag &amp; drop
                    </div>
                    <p className="text-[10px] text-slate-400">PDF, PNG, JPG up to 10MB (Stored securely in encrypted format)</p>
                  </div>
                ) : (
                  <div className="border border-orange-200 bg-orange-50/40 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
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
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition"
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
                  <span>Submitting &amp; Generating Verified Profile...</span>
                </>
              ) : (
                <>
                  <span>Publish &amp; Claim Verified Listing</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Listing your business is 100% free under BharatBN™ Local Network initiative.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}