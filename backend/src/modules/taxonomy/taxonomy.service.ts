import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxonomyService {
  private categories = [
    { id: 'cat-1', name: 'Healthcare & Clinics', slug: 'healthcare-clinics', icon: 'Stethoscope' },
    { id: 'cat-2', name: 'Education & Preschools', slug: 'education-preschools', icon: 'GraduationCap' },
    { id: 'cat-3', name: 'Automobile & EV Showrooms', slug: 'automobile-ev-showrooms', icon: 'Car' },
    { id: 'cat-4', name: 'Restaurants & Cafes', slug: 'restaurants-cafes', icon: 'UtensilsCrossed' },
    { id: 'cat-5', name: 'Real Estate & Builders', slug: 'real-estate-builders', icon: 'Building2' },
    { id: 'cat-6', name: 'Legal & Financial Services', slug: 'legal-financial-services', icon: 'Briefcase' },
    { id: 'cat-7', name: 'Beauty, Spa & Salons', slug: 'beauty-spa-salons', icon: 'Sparkles' },
    { id: 'cat-8', name: 'Home & Industrial Services', slug: 'home-industrial-services', icon: 'Wrench' },
  ];

  private locations = [
    { id: 'loc-1', name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', type: 'city' },
    { id: 'loc-2', name: 'Pune', slug: 'pune', state: 'Maharashtra', type: 'city' },
    { id: 'loc-3', name: 'New Delhi', slug: 'new-delhi', state: 'Delhi NCR', type: 'city' },
    { id: 'loc-4', name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', type: 'city' },
    { id: 'loc-5', name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', type: 'city' },
    { id: 'loc-6', name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat', type: 'city' },
    { id: 'loc-7', name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu', type: 'city' },
    { id: 'loc-8', name: 'Noida', slug: 'noida', state: 'Uttar Pradesh', type: 'city' },
    { id: 'loc-9', name: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh', type: 'city' },
  ];

  getCategories() {
    return this.categories;
  }

  getLocations() {
    return this.locations;
  }
}

