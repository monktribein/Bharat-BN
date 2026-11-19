import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import * as crypto from 'crypto';

export interface BusinessEntity {
  id: string;
  name: string;
  slug: string;
  napHash: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  addressLine: string;
  citySlug?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  services: string[];
  categorySlug?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'pending_review' | 'published' | 'archived';
  isClaimed: boolean;
  isVerified: boolean;
  isSponsor?: boolean;
  verifiedAt?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class BusinessesService {
  private businesses: BusinessEntity[] = [
    {
      id: 'BBN-CLM-799760',
      name: 'Apple',
      slug: 'apple',
      napHash: 'demo-hash-apple-001',
      phone: '+919717056860',
      whatsapp: '+919717056860',
      email: 'apple@business.in',
      website: 'https://apple.com',
      addressLine: 'Gali Number 14, Master Park, Khora Colony, Ghaziabad, Noida',
      citySlug: 'noida',
      pincode: '102010',
      latitude: 28.5355,
      longitude: 77.391,
      services: ['Electric Vehicles & Cars', 'Automobile Accessories & Spares', 'Authorized EV Dealership'],
      categorySlug: 'automobile-ev-showrooms',
      description: 'Apple (Noida Hub) is an audited enterprise business listed on BharatBN™ Business Network. Specializing in next-gen Automobile & EV solutions, verified ROC & GST registration certificates, and direct customer inquiry channels across Noida / NCR.',
      seoTitle: 'Apple | Noida',
      seoDescription: 'Apple (Noida Hub) is an audited enterprise business listed on BharatBN™ Business Network. Specializing in next-gen Automobile & EV solutions, verified ROC & GST registration certificates, and direct customer inquiry channels across Noida / NCR.',
      status: 'published',
      isClaimed: true,
      isVerified: true,
      isSponsor: true,
      verifiedAt: new Date().toISOString(),
      viewsCount: 684,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'BBN-CLM-982104',
      name: 'Choco Delights & Confectionery (Cadboury)',
      slug: 'choco-delights-confectionery-cadboury',
      napHash: 'demo-hash-choco-001',
      phone: '+918965326578',
      whatsapp: '+918965326578',
      email: 'contact@chocodelights.in',
      website: 'https://chocodelights.in',
      addressLine: 'Shop 12, Crystal Plaza, New Link Road, Andheri West',
      citySlug: 'mumbai',
      pincode: '400053',
      latitude: 19.1363,
      longitude: 72.8277,
      services: ['Artisan Dark Chocolates', 'Belgian Cocoa Truffles', 'Custom Corporate Hampers'],
      categorySlug: 'food-confectionery',
      description: 'Choco Delights & Confectionery (Cadboury) is an audited premier confectionery brand in Andheri West, Mumbai. Certified for food safety standards, direct Belgian cocoa imports, and same-day temperature-controlled gift delivery across Mumbai.',
      seoTitle: 'Choco Delights & Confectionery (Cadboury) | Mumbai',
      seoDescription: 'Choco Delights & Confectionery (Cadboury) is an audited premier confectionery brand in Andheri West, Mumbai. Certified for food safety standards, direct Belgian cocoa imports, and same-day temperature-controlled gift delivery across Mumbai.',
      status: 'published',
      isClaimed: true,
      isVerified: true,
      isSponsor: false,
      verifiedAt: new Date().toISOString(),
      viewsCount: 512,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '55555555-5555-5555-5555-555555555001',
      name: 'Apex Super Speciality Dental Clinic',
      slug: 'apex-super-speciality-dental-clinic-andheri-mumbai',
      napHash: 'demo-hash-001',
      phone: '+919820012345',
      whatsapp: '+919820012345',
      email: 'care@apexdentalmumbai.com',
      website: 'https://apexdentalmumbai.com',
      addressLine: 'Shop 4, Greenfield Heights, Lokhandwala Complex, Andheri West',
      citySlug: 'mumbai',
      pincode: '400053',
      latitude: 19.1363,
      longitude: 72.8277,
      services: ['Invisalign', 'Root Canal Treatment', 'Teeth Whitening', 'Dental Implants'],
      categorySlug: 'healthcare-clinics',
      description: 'Leading dental super-speciality clinic in Andheri West, Mumbai equipped with 3D digital imaging.',
      status: 'published',
      isClaimed: true,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      viewsCount: 342,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '55555555-5555-5555-5555-555555555002',
      name: 'Little Elly International Preschool',
      slug: 'little-elly-international-preschool-indiranagar-bengaluru',
      napHash: 'demo-hash-002',
      phone: '+919845012345',
      whatsapp: '+919845012345',
      email: 'admissions@littleellyindiranagar.com',
      website: 'https://littleelly.com',
      addressLine: '12th Main Road, HAL 2nd Stage, Indiranagar',
      citySlug: 'bengaluru',
      pincode: '560038',
      latitude: 12.9719,
      longitude: 77.6412,
      services: ['Toddler Care', 'Pre-K Program', 'Daycare', 'Activity Club'],
      categorySlug: 'education-preschools',
      description: 'Award-winning child development and early education preschool center in Bengaluru.',
      status: 'published',
      isClaimed: false,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      viewsCount: 198,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  generateSlug(name: string, city?: string): string {
    const raw = `${name} ${city || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return raw;
  }

  computeNapHash(name: string, address: string, phone: string): string {
    const combined = `${name.trim().toLowerCase()}|${address.trim().toLowerCase()}|${phone.trim()}`;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  findAll(query: { q?: string; category?: string; city?: string; page?: number; limit?: number }) {
    let list = [...this.businesses].filter((b) => b.status === 'published');

    if (query.q) {
      const q = query.q.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.services.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (query.category) {
      list = list.filter((b) => b.categorySlug === query.category);
    }

    if (query.city) {
      list = list.filter((b) => b.citySlug === query.city);
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total: list.length,
      page,
      totalPages: Math.ceil(list.length / limit),
    };
  }

  findByIdOrSlug(idOrSlug: string): BusinessEntity {
    const item = this.businesses.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
    if (!item) {
      throw new NotFoundException(`Business with identifier '${idOrSlug}' not found.`);
    }
    item.viewsCount += 1;
    return item;
  }

  create(dto: CreateBusinessDto): BusinessEntity {
    const napHash = this.computeNapHash(dto.name, dto.addressLine, dto.phone);

    // Duplicate check via NAP hash
    const duplicate = this.businesses.find((b) => b.napHash === napHash);
    if (duplicate) {
      throw new ConflictException(
        `A business record with matching Name, Address, and Phone already exists: ${duplicate.name}`,
      );
    }

    let baseSlug = this.generateSlug(dto.name, dto.citySlug);
    let finalSlug = baseSlug;
    let counter = 1;
    while (this.businesses.some((b) => b.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const newEntity: BusinessEntity = {
      id: crypto.randomUUID(),
      name: dto.name,
      slug: finalSlug,
      napHash,
      phone: dto.phone,
      whatsapp: dto.whatsapp || dto.phone,
      email: dto.email,
      website: dto.website,
      addressLine: dto.addressLine,
      citySlug: dto.citySlug,
      pincode: dto.pincode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      services: dto.services || [],
      categorySlug: dto.categorySlug,
      description: dto.description,
      status: 'published',
      isClaimed: false,
      isVerified: false,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.businesses.unshift(newEntity);
    return newEntity;
  }

  update(idOrSlug: string, updates: Partial<BusinessEntity>): BusinessEntity {
    const cleanId = (idOrSlug || '').toLowerCase().trim();
    const index = this.businesses.findIndex(
      (b) => b.id.toLowerCase() === cleanId || b.slug.toLowerCase() === cleanId,
    );
    if (index === -1) {
      throw new NotFoundException(`Business with identifier '${idOrSlug}' not found.`);
    }

    const current = this.businesses[index];
    const updated: BusinessEntity = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.isVerified !== undefined) {
      updated.isVerified = updates.isVerified;
      if (updates.isVerified && !updated.verifiedAt) {
        updated.verifiedAt = new Date().toISOString();
      }
    }

    this.businesses[index] = updated;
    return updated;
  }
}

