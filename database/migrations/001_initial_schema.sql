-- ========================================================================
-- BharatBN™ Core Database Schema - Migration 001
-- Engine 7 | Bizwoke Nova | Version 1.0
-- Compatible with Supabase PostgreSQL 15+ / PostGIS
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'standard', -- 'standard', 'franchise_hq', 'agency', 'enterprise'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users & Memberships (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id VARCHAR(255) UNIQUE, -- Supabase auth.users reference
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'visitor', 'business_owner', 'franchise_hq_admin', 'branch_manager', 'sales_executive', 'seo_editor', 'seo_manager', 'finance', 'super_admin', 'auditor'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_membership_user_org UNIQUE (user_id, organization_id)
);

-- 3. Geography & Locations (State > District > City > Locality)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'state', 'district', 'city', 'locality'
    state_code VARCHAR(10),
    pincode VARCHAR(20),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_location_type_slug UNIQUE (type, slug)
);
CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);

-- 4. Category Taxonomy
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon_name VARCHAR(100),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- 5. Businesses (Directory Listings)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    nap_hash VARCHAR(64), -- SHA-256 hash of Name+Address+Phone for duplicate prevention
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    address_line TEXT NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    pincode VARCHAR(20),
    lat_lng GEOGRAPHY(Point, 4326),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    business_hours JSONB DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'published', -- 'draft', 'pending_review', 'published', 'archived'
    is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    views_count BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_businesses_location_id ON businesses(location_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_nap_hash ON businesses(nap_hash);

-- Business Category Mapping
CREATE TABLE IF NOT EXISTS business_categories (
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (business_id, category_id)
);

-- 6. Enterprise Franchise (Brand HQ & Outlets)
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    website VARCHAR(255),
    total_outlets INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    outlet_code VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. URL Registry (Hybrid Routing: WordPress vs Next.js)
CREATE TABLE IF NOT EXISTS url_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path VARCHAR(500) UNIQUE NOT NULL,
    owner VARCHAR(50) NOT NULL DEFAULT 'next', -- 'wordpress', 'next'
    migration_state VARCHAR(50) NOT NULL DEFAULT 'completed', -- 'legacy_wp', 'in_progress', 'completed'
    redirect_target VARCHAR(500),
    status_code INT NOT NULL DEFAULT 200, -- 200, 301, 302, 410
    entity_type VARCHAR(100), -- 'business', 'category', 'city', 'article'
    entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_url_registry_path ON url_registry(path);

-- Legacy WordPress Mappings
CREATE TABLE IF NOT EXISTS legacy_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wp_post_id BIGINT UNIQUE NOT NULL,
    wp_url TEXT NOT NULL,
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    sync_hash VARCHAR(64),
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Business Claims & Moderation
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    work_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    evidence_type VARCHAR(100) NOT NULL, -- 'gst_certificate', 'utility_bill', 'official_id', 'domain_email'
    evidence_ref TEXT NOT NULL, -- Storage URL
    notes TEXT,
    review_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Leads & Inquiries Engine
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    inquirer_name VARCHAR(255) NOT NULL,
    inquirer_phone VARCHAR(50) NOT NULL,
    inquirer_email VARCHAR(255),
    message TEXT,
    source_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'closed'
    is_whatsapp_dispatched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_business_id ON leads(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Click-to-Call and WhatsApp Click Tracking (Separated from verified leads)
CREATE TABLE IF NOT EXISTS interaction_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'click_to_call', 'click_to_whatsapp', 'share', 'map_view'
    referrer_url TEXT,
    user_agent TEXT,
    ip_address_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Pay-As-You-Rank™ Campaigns & Milestones
CREATE TABLE IF NOT EXISTS seo_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    target_url TEXT NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    city_name VARCHAR(100) NOT NULL,
    device VARCHAR(50) NOT NULL DEFAULT 'mobile', -- 'mobile', 'desktop'
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    baseline_position INT,
    current_position INT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_advance', -- 'pending_advance', 'active', 'completed', 'paused', 'cancelled'
    campaign_term_days INT NOT NULL DEFAULT 90,
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rank_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES seo_campaigns(id) ON DELETE CASCADE,
    position INT NOT NULL,
    observed_url TEXT NOT NULL,
    provider VARCHAR(100) NOT NULL, -- 'dataforseo', 'valueserp', 'manual'
    evidence_ref TEXT, -- Screenshot or raw JSON response reference
    is_qualifying BOOLEAN DEFAULT FALSE,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rank_checks_campaign_id ON rank_checks(campaign_id);

CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES seo_campaigns(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'advance_25', 'top_20', 'top_10'
    percentage INT NOT NULL, -- 25, 25, 50
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'locked', -- 'locked', 'eligible', 'verified', 'invoiced', 'paid'
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    qualification_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_milestone_campaign_type UNIQUE (campaign_id, type)
);

-- 11. Invoices & Payments
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    due_date DATE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    payment_provider VARCHAR(50) NOT NULL, -- 'razorpay', 'stripe'
    payment_ref VARCHAR(255) UNIQUE NOT NULL, -- Transaction ID
    idempotency_key VARCHAR(255) UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'refunded'
    webhook_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

