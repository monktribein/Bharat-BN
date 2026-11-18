-- ========================================================================
-- BharatBN™ Seed Data - Initial Taxonomy & Geographic Hierarchy
-- ========================================================================

-- 1. Seed Top-Level Categories
INSERT INTO categories (id, name, slug, icon_name, description, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111001', 'Healthcare & Clinics', 'healthcare-clinics', 'Stethoscope', 'Doctors, hospitals, diagnostic centers, and clinics', 1),
  ('11111111-1111-1111-1111-111111111002', 'Education & Preschools', 'education-preschools', 'GraduationCap', 'Schools, play schools, coaching institutes, and colleges', 2),
  ('11111111-1111-1111-1111-111111111003', 'Automobile & EV Showrooms', 'automobile-ev-showrooms', 'Car', 'Car dealers, bike showrooms, service centers, and EV charging', 3),
  ('11111111-1111-1111-1111-111111111004', 'Restaurants & Cafes', 'restaurants-cafes', 'UtensilsCrossed', 'Fine dining, cafes, bakeries, and cloud kitchens', 4),
  ('11111111-1111-1111-1111-111111111005', 'Real Estate & Builders', 'real-estate-builders', 'Building2', 'Property dealers, developers, co-working, and architects', 5),
  ('11111111-1111-1111-1111-111111111006', 'Legal & Financial Services', 'legal-financial-services', 'Briefcase', 'CA, corporate lawyers, tax consultants, and advisors', 6),
  ('11111111-1111-1111-1111-111111111007', 'Beauty, Spa & Salons', 'beauty-spa-salons', 'Sparkles', 'Hair salons, luxury spas, nail art, and wellness centers', 7),
  ('11111111-1111-1111-1111-111111111008', 'Home & Industrial Services', 'home-industrial-services', 'Wrench', 'Plumbers, electricians, interior designers, and fabrication', 8)
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed States
INSERT INTO locations (id, name, slug, type, state_code)
VALUES
  ('22222222-2222-2222-2222-222222222001', 'Maharashtra', 'maharashtra', 'state', 'MH'),
  ('22222222-2222-2222-2222-222222222002', 'Delhi NCR', 'delhi-ncr', 'state', 'DL'),
  ('22222222-2222-2222-2222-222222222003', 'Karnataka', 'karnataka', 'state', 'KA'),
  ('22222222-2222-2222-2222-222222222004', 'Telangana', 'telangana', 'state', 'TS'),
  ('22222222-2222-2222-2222-222222222005', 'Gujarat', 'gujarat', 'state', 'GJ'),
  ('22222222-2222-2222-2222-222222222006', 'Tamil Nadu', 'tamil-nadu', 'state', 'TN'),
  ('22222222-2222-2222-2222-222222222007', 'Uttar Pradesh', 'uttar-pradesh', 'state', 'UP')
ON CONFLICT (type, slug) DO NOTHING;

-- 3. Seed Major Tier-1 / Tier-2 Cities
INSERT INTO locations (id, parent_id, name, slug, type, latitude, longitude)
VALUES
  ('33333333-3333-3333-3333-333333333001', '22222222-2222-2222-2222-222222222001', 'Mumbai', 'mumbai', 'city', 19.0760, 72.8777),
  ('33333333-3333-3333-3333-333333333002', '22222222-2222-2222-2222-222222222001', 'Pune', 'pune', 'city', 18.5204, 73.8567),
  ('33333333-3333-3333-3333-333333333003', '22222222-2222-2222-2222-222222222002', 'New Delhi', 'new-delhi', 'city', 28.6139, 77.2090),
  ('33333333-3333-3333-3333-333333333004', '22222222-2222-2222-2222-222222222003', 'Bengaluru', 'bengaluru', 'city', 12.9716, 77.5946),
  ('33333333-3333-3333-3333-333333333005', '22222222-2222-2222-2222-222222222004', 'Hyderabad', 'hyderabad', 'city', 17.3850, 78.4867),
  ('33333333-3333-3333-3333-333333333006', '22222222-2222-2222-2222-222222222005', 'Ahmedabad', 'ahmedabad', 'city', 23.0225, 72.5714),
  ('33333333-3333-3333-3333-333333333007', '22222222-2222-2222-2222-222222222006', 'Chennai', 'chennai', 'city', 13.0827, 80.2707),
  ('33333333-3333-3333-3333-333333333008', '22222222-2222-2222-2222-222222222007', 'Noida', 'noida', 'city', 28.5355, 77.3910),
  ('33333333-3333-3333-3333-333333333009', '22222222-2222-2222-2222-222222222007', 'Lucknow', 'lucknow', 'city', 26.8467, 80.9462)
ON CONFLICT (type, slug) DO NOTHING;

-- 4. Seed Pilot Sample Verified Business
INSERT INTO organizations (id, name, type, status)
VALUES ('44444444-4444-4444-4444-444444444001', 'Apex Dental Care Group', 'standard', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO businesses (
  id, owner_org_id, name, slug, phone, whatsapp, email, website,
  address_line, location_id, pincode, latitude, longitude,
  services, description, status, is_claimed, is_verified, verified_at
)
VALUES (
  '55555555-5555-5555-5555-555555555001',
  '44444444-4444-4444-4444-444444444001',
  'Apex Super Speciality Dental Clinic',
  'apex-super-speciality-dental-clinic-andheri-mumbai',
  '+919820012345',
  '+919820012345',
  'care@apexdentalmumbai.com',
  'https://apexdentalmumbai.com',
  'Shop 4, Greenfield Heights, Lokhandwala Complex, Andheri West',
  '33333333-3333-3333-3333-333333333001', -- Mumbai
  '400053',
  19.1363,
  72.8277,
  ARRAY['Invisalign', 'Root Canal Treatment', 'Teeth Whitening', 'Dental Implants', 'Pediatric Dentistry'],
  'Leading dental super-speciality clinic in Andheri West, Mumbai equipped with 3D digital imaging and painless treatment procedures.',
  'published',
  TRUE,
  TRUE,
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Map to Healthcare Category
INSERT INTO business_categories (business_id, category_id, is_primary)
VALUES (
  '55555555-5555-5555-5555-555555555001',
  '11111111-1111-1111-1111-111111111001',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Register canonical URL in url_registry
INSERT INTO url_registry (path, owner, migration_state, status_code, entity_type, entity_id)
VALUES (
  '/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
  'next',
  'completed',
  200,
  'business',
  '55555555-5555-5555-5555-555555555001'
)
ON CONFLICT (path) DO NOTHING;

