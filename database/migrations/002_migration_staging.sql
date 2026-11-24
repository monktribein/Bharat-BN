-- ========================================================================
-- BharatBN™ WordPress to Supabase Staging Schema - Migration 002
-- Mission FTC | Engine 7 | SOP Implementation
-- Staging tables for idempotent extraction & transformation
-- ========================================================================

-- 1. Staging Table: WordPress Listings / Posts
CREATE TABLE IF NOT EXISTS migration_wp_listings (
    legacy_wp_id BIGINT PRIMARY KEY,
    source_url TEXT NOT NULL,
    post_title TEXT NOT NULL,
    post_name TEXT NOT NULL, -- slug
    post_type VARCHAR(50) NOT NULL DEFAULT 'post', -- 'post', 'blog', 'page'
    post_status VARCHAR(50) NOT NULL DEFAULT 'publish',
    post_date TIMESTAMPTZ,
    author_login TEXT,
    author_email TEXT,
    phone VARCHAR(50),
    city VARCHAR(100),
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    thumbnail_id BIGINT,
    categories JSONB DEFAULT '[]'::jsonb,
    raw_payload JSONB NOT NULL,
    source_updated_at TIMESTAMPTZ,
    imported_at TIMESTAMPTZ DEFAULT NOW(),
    migration_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'transformed', 'failed'
    transformed_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_migration_wp_listings_status ON migration_wp_listings(migration_status);
CREATE INDEX IF NOT EXISTS idx_migration_wp_listings_post_type ON migration_wp_listings(post_type);
CREATE INDEX IF NOT EXISTS idx_migration_wp_listings_city ON migration_wp_listings(city);

-- 2. Staging Table: WordPress Media Attachments
CREATE TABLE IF NOT EXISTS migration_wp_attachments (
    attachment_id BIGINT PRIMARY KEY,
    parent_post_id BIGINT,
    source_url TEXT NOT NULL,
    original_filename TEXT,
    title TEXT,
    alt_text TEXT,
    caption TEXT,
    mime_type VARCHAR(100),
    target_storage_path TEXT,
    migration_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'downloaded', 'uploaded_to_storage', 'failed'
    imported_at TIMESTAMPTZ DEFAULT NOW(),
    transformed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_migration_wp_attachments_parent ON migration_wp_attachments(parent_post_id);
CREATE INDEX IF NOT EXISTS idx_migration_wp_attachments_status ON migration_wp_attachments(migration_status);

-- 3. Staging Table: SEO Metadata Registry
CREATE TABLE IF NOT EXISTS migration_wp_seo (
    legacy_wp_id BIGINT PRIMARY KEY,
    url TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    focus_keywords TEXT,
    robots_meta JSONB DEFAULT '{}'::jsonb,
    imported_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ensure URL Registry (Option B Hybrid Routing)
ALTER TABLE url_registry ADD COLUMN IF NOT EXISTS migration_status TEXT DEFAULT 'legacy';

CREATE INDEX IF NOT EXISTS idx_url_registry_owner ON url_registry(owner);
CREATE INDEX IF NOT EXISTS idx_url_registry_status ON url_registry(migration_state);
