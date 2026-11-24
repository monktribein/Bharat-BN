-- ========================================================================
-- BharatBN™ WordPress ETL: Transform Staging to Production Schema - 003
-- Mission FTC | Engine 7 | SOP Phase 4 Implementation
-- ========================================================================

-- Function: Transform Staged WordPress Listings into Production Tables
CREATE OR REPLACE FUNCTION transform_wp_staged_listings(batch_limit INT DEFAULT 500)
RETURNS TABLE(
    total_processed INT,
    total_inserted INT,
    total_updated INT,
    total_errors INT
) AS $$
DECLARE
    rec RECORD;
    v_business_id UUID;
    v_clean_phone VARCHAR(50);
    v_clean_slug VARCHAR(255);
    v_nap_hash VARCHAR(64);
    v_proc INT := 0;
    v_ins INT := 0;
    v_upd INT := 0;
    v_err INT := 0;
BEGIN
    FOR rec IN 
        SELECT * FROM migration_wp_listings 
        WHERE migration_status = 'pending' AND post_type = 'post'
        ORDER BY legacy_wp_id ASC
        LIMIT batch_limit
    LOOP
        v_proc := v_proc + 1;
        BEGIN
            -- 1. Clean and normalize fields
            v_clean_phone := COALESCE(NULLIF(TRIM(rec.phone), ''), '0000000000');
            v_clean_slug := LOWER(REGEXP_REPLACE(COALESCE(NULLIF(TRIM(rec.post_name), ''), TRIM(rec.post_title)), '[^a-zA-Z0-9]+', '-', 'g'));
            v_clean_slug := TRIM(BOTH '-' FROM v_clean_slug);
            IF v_clean_slug = '' THEN
                v_clean_slug := 'listing-' || rec.legacy_wp_id;
            END IF;

            -- Calculate NAP Hash for duplicate prevention (Name + Address + Phone)
            v_nap_hash := encode(digest(LOWER(TRIM(rec.post_title)) || '|' || LOWER(TRIM(COALESCE(rec.address, ''))) || '|' || LOWER(v_clean_phone), 'sha256'), 'hex');

            -- 2. Check if already mapped in legacy_mappings
            SELECT entity_id INTO v_business_id FROM legacy_mappings WHERE wp_post_id = rec.legacy_wp_id;

            IF v_business_id IS NOT NULL THEN
                -- Update existing production business
                UPDATE businesses SET
                    name = rec.post_title,
                    phone = v_clean_phone,
                    address_line = COALESCE(rec.address, 'India'),
                    latitude = rec.latitude,
                    longitude = rec.longitude,
                    updated_at = NOW()
                WHERE id = v_business_id;
                v_upd := v_upd + 1;
            ELSE
                -- Generate new UUID for new business
                v_business_id := uuid_generate_v4();

                -- Ensure unique slug by appending legacy_wp_id if exists
                IF EXISTS (SELECT 1 FROM businesses WHERE slug = v_clean_slug) THEN
                    v_clean_slug := v_clean_slug || '-' || rec.legacy_wp_id;
                END IF;

                -- Insert into production businesses table
                INSERT INTO businesses (
                    id, name, slug, phone, address_line, 
                    latitude, longitude, status, is_claimed, is_verified,
                    nap_hash, created_at, updated_at
                ) VALUES (
                    v_business_id,
                    rec.post_title,
                    v_clean_slug,
                    v_clean_phone,
                    COALESCE(rec.address, 'India'),
                    rec.latitude,
                    rec.longitude,
                    CASE WHEN rec.post_status = 'publish' THEN 'published' ELSE 'draft' END,
                    FALSE,
                    FALSE,
                    v_nap_hash,
                    COALESCE(rec.post_date, NOW()),
                    NOW()
                );

                -- Record stable legacy mapping (WordPress ID -> Supabase UUID)
                INSERT INTO legacy_mappings (
                    wp_post_id, wp_url, entity_id, entity_type, sync_hash
                ) VALUES (
                    rec.legacy_wp_id,
                    rec.source_url,
                    v_business_id,
                    'business',
                    v_nap_hash
                ) ON CONFLICT (wp_post_id) DO NOTHING;

                v_ins := v_ins + 1;
            END IF;

            -- 3. Update URL Registry mapping to point to the newly assigned UUID
            UPDATE url_registry SET
                entity_id = v_business_id,
                entity_type = 'business',
                updated_at = NOW()
            WHERE path = '/' || rec.post_name || '/' OR path = rec.source_url;

            -- 4. Mark staging record as transformed
            UPDATE migration_wp_listings SET
                migration_status = 'transformed',
                transformed_at = NOW(),
                error_message = NULL
            WHERE legacy_wp_id = rec.legacy_wp_id;

        EXCEPTION WHEN OTHERS THEN
            v_err := v_err + 1;
            UPDATE migration_wp_listings SET
                migration_status = 'failed',
                error_message = SQLERRM
            WHERE legacy_wp_id = rec.legacy_wp_id;
        END;
    END LOOP;

    RETURN QUERY SELECT v_proc, v_ins, v_upd, v_err;
END;
$$ LANGUAGE plpgsql;
