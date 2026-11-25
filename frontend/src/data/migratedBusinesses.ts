import allBusinessesData from './allBusinesses.json';

export interface VerifiedBusiness {
  id: string;
  wpId?: number;
  name: string;
  slug: string;
  category: string;
  categorySlug?: string;
  city: string;
  citySlug?: string;
  address?: string;
  phone: string;
  whatsapp: string;
  image?: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
  services?: string[];
  isVerified: boolean;
  isClaimed?: boolean;
  statusText?: string;
}

export const realMigratedBusinesses: VerifiedBusiness[] = allBusinessesData as VerifiedBusiness[];
