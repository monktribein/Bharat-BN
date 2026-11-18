import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface BrandEntity {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  totalOutlets: number;
  createdAt: string;
}

export interface BranchRecord {
  id: string;
  brandId: string;
  outletName: string;
  outletCode: string;
  city: string;
  phone: string;
  managerEmail?: string;
  createdAt: string;
}

@Injectable()
export class FranchiseService {
  private brands: BrandEntity[] = [
    {
      id: 'brand-001',
      name: 'Dr. Batra’s Healthcare',
      slug: 'dr-batras-healthcare',
      logoUrl: 'https://storage.bharatbn.com/brands/dr-batras.png',
      website: 'https://drbatras.com',
      totalOutlets: 185,
      createdAt: new Date().toISOString(),
    },
  ];

  private branches: BranchRecord[] = [
    {
      id: 'branch-101',
      brandId: 'brand-001',
      outletName: 'Dr. Batra’s Clinics - Bandra West',
      outletCode: 'DB-MUM-01',
      city: 'mumbai',
      phone: '+919820011111',
      managerEmail: 'bandra@drbatras.com',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'branch-102',
      brandId: 'brand-001',
      outletName: 'Dr. Batra’s Clinics - Koramangala',
      outletCode: 'DB-BLR-04',
      city: 'bengaluru',
      phone: '+919845022222',
      managerEmail: 'koramangala@drbatras.com',
      createdAt: new Date().toISOString(),
    },
  ];

  createBrand(data: { name: string; website?: string; logoUrl?: string }): BrandEntity {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brand: BrandEntity = {
      id: crypto.randomUUID(),
      name: data.name,
      slug,
      website: data.website,
      logoUrl: data.logoUrl,
      totalOutlets: 0,
      createdAt: new Date().toISOString(),
    };
    this.brands.push(brand);
    return brand;
  }

  getBrand(idOrSlug: string): BrandEntity {
    const brand = this.brands.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
    if (!brand) {
      throw new NotFoundException(`Brand '${idOrSlug}' not found.`);
    }
    return brand;
  }

  getBranches(brandId: string): BranchRecord[] {
    return this.branches.filter((b) => b.brandId === brandId);
  }

  bulkImportBranches(
    brandId: string,
    rows: Array<{ outletName: string; outletCode: string; city: string; phone: string; managerEmail?: string }>,
  ) {
    const brand = this.getBrand(brandId);
    let imported = 0;
    let duplicates = 0;

    for (const row of rows) {
      const exists = this.branches.some(
        (b) => b.brandId === brandId && b.outletCode.toLowerCase() === row.outletCode.toLowerCase(),
      );
      if (exists) {
        duplicates++;
        continue;
      }

      this.branches.push({
        id: crypto.randomUUID(),
        brandId,
        outletName: row.outletName,
        outletCode: row.outletCode,
        city: row.city,
        phone: row.phone,
        managerEmail: row.managerEmail,
        createdAt: new Date().toISOString(),
      });
      imported++;
    }

    brand.totalOutlets = this.branches.filter((b) => b.brandId === brandId).length;

    return {
      success: true,
      totalReceived: rows.length,
      importedCount: imported,
      duplicateCount: duplicates,
    };
  }
}

