/**
 * BharatBN™ Automated Supabase Migration & Staging Importer
 * Uses safe parameterized queries and sanitizes rogue coordinates.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require(path.join(__dirname, '../../backend/node_modules/pg'));

const CONNECTION_STRING = 'postgresql://postgres.npqcobfdcypxtdodeccx:NbH3gP6F2BJMvUdj@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

async function main() {
  console.log('🚀 Connecting to Supabase PostgreSQL...');
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 120000,
  });

  await client.connect();
  console.log('✅ Connected successfully to Supabase!');

  // 1. Run 001_initial_schema.sql
  console.log('\n📦 Step 1: Deploying 001_initial_schema.sql...');
  const schema1 = fs.readFileSync(path.join(__dirname, '../migrations/001_initial_schema.sql'), 'utf8');
  await client.query(schema1);
  console.log('✅ 001_initial_schema.sql executed successfully!');

  // 2. Run 002_migration_staging.sql
  console.log('\n📦 Step 2: Deploying 002_migration_staging.sql...');
  const schema2 = fs.readFileSync(path.join(__dirname, '../migrations/002_migration_staging.sql'), 'utf8');
  await client.query(schema2);

  // Relax coordinates to DOUBLE PRECISION to prevent overflow from rogue WP values
  await client.query(`
    ALTER TABLE businesses ALTER COLUMN latitude TYPE DOUBLE PRECISION;
    ALTER TABLE businesses ALTER COLUMN longitude TYPE DOUBLE PRECISION;
    ALTER TABLE migration_wp_listings ALTER COLUMN latitude TYPE DOUBLE PRECISION;
    ALTER TABLE migration_wp_listings ALTER COLUMN longitude TYPE DOUBLE PRECISION;
  `);
  console.log('✅ 002_migration_staging.sql & column types updated successfully!');

  // 3. Load from staged_listings.json with Parameterized Batch Inserts
  console.log('\n📦 Step 3: Importing 1,622 listings into migration_wp_listings via parameterized batches...');
  const stagedListingsPath = path.join(__dirname, '../wp_export/staged_listings.json');
  const listings = JSON.parse(fs.readFileSync(stagedListingsPath, 'utf8'));

  const BATCH_SIZE = 50;
  for (let i = 0; i < listings.length; i += BATCH_SIZE) {
    const batch = listings.slice(i, i + BATCH_SIZE);
    const valuePlaceholders = [];
    const params = [];

    batch.forEach((item, bIdx) => {
      const offset = bIdx * 17;
      valuePlaceholders.push(`(
        $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6},
        $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12},
        $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}, $${offset + 17}
      )`);

      // Sanitize lat / lng
      const validLat = item.latitude !== null && !isNaN(item.latitude) && Math.abs(item.latitude) <= 90 ? item.latitude : null;
      const validLng = item.longitude !== null && !isNaN(item.longitude) && Math.abs(item.longitude) <= 180 ? item.longitude : null;

      params.push(
        item.id,
        item.sourceUrl || '',
        item.title || '',
        item.slug || '',
        item.type || 'post',
        item.status || 'publish',
        item.date ? new Date(item.date) : null,
        item.creator || '',
        item.phone || '',
        item.city || '',
        item.address || '',
        validLat,
        validLng,
        item.thumbnailId !== null ? item.thumbnailId : null,
        JSON.stringify(item.categories || []),
        JSON.stringify({ seo: item.seo || {}, meta_sample: item.meta || {} }),
        'pending'
      );
    });

    const query = `
      INSERT INTO migration_wp_listings (
        legacy_wp_id, source_url, post_title, post_name, post_type, post_status,
        post_date, author_login, phone, city, address, latitude, longitude,
        thumbnail_id, categories, raw_payload, migration_status
      ) VALUES ${valuePlaceholders.join(',\n')}
      ON CONFLICT (legacy_wp_id) DO UPDATE SET
        post_title = EXCLUDED.post_title,
        phone = EXCLUDED.phone,
        city = EXCLUDED.city,
        address = EXCLUDED.address,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        raw_payload = EXCLUDED.raw_payload;
    `;

    await client.query(query, params);

    // Also populate url_registry for this batch
    const regPlaceholders = [];
    const regParams = [];
    batch.forEach((item, rIdx) => {
      let targetPath = (item.sourceUrl || '').replace(/^https?:\/\/[^\/]+/, '');
      if (!targetPath) targetPath = `/${item.slug}/`;
      const offset = rIdx * 5;
      regPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
      regParams.push(targetPath, 'wordpress', 'legacy', 200, 'business');
    });

    const regQuery = `
      INSERT INTO url_registry (path, owner, migration_state, status_code, entity_type)
      VALUES ${regPlaceholders.join(',\n')}
      ON CONFLICT (path) DO NOTHING;
    `;
    await client.query(regQuery, regParams);

    if ((i + BATCH_SIZE) % 200 === 0 || i + BATCH_SIZE >= listings.length) {
      console.log(`  Imported ${Math.min(i + BATCH_SIZE, listings.length)}/${listings.length} listings...`);
    }
  }

  const stagingCount = await client.query('SELECT count(*) FROM migration_wp_listings;');
  console.log(`✅ Staging Table Populated: ${stagingCount.rows[0].count} listings verified!`);

  // 4. Run 003_transform_staging_to_production.sql
  console.log('\n📦 Step 4: Deploying 003_transform_staging_to_production.sql function...');
  const schema3 = fs.readFileSync(path.join(__dirname, '../migrations/003_transform_staging_to_production.sql'), 'utf8');
  await client.query(schema3);
  console.log('✅ Transformation function created!');

  // Execute transformation in batches
  console.log('🔄 Executing transform_wp_staged_listings()...');
  let totalProc = 0;
  let totalIns = 0;
  let totalUpd = 0;
  let totalErr = 0;

  while (true) {
    const res = await client.query('SELECT * FROM transform_wp_staged_listings(500);');
    const r = res.rows[0];
    totalProc += r.total_processed;
    totalIns += r.total_inserted;
    totalUpd += r.total_updated;
    totalErr += r.total_errors;

    console.log(`  Batch: Processed=${r.total_processed}, Inserted=${r.total_inserted}, Errors=${r.total_errors}`);
    if (r.total_processed === 0) break;
  }

  console.log(`\n🎉 Transformation Complete!`);
  console.log(`  Total Processed: ${totalProc}`);
  console.log(`  Total Inserted in businesses: ${totalIns}`);
  console.log(`  Total Updated: ${totalUpd}`);
  console.log(`  Total Errors: ${totalErr}`);

  // Final table counts
  const finalBiz = await client.query('SELECT count(*) FROM businesses;');
  const finalReg = await client.query('SELECT count(*) FROM url_registry;');
  const finalMap = await client.query('SELECT count(*) FROM legacy_mappings;');

  console.log('\n📊 Final Production Database Stats:');
  console.log(`  - Production Businesses: ${finalBiz.rows[0].count}`);
  console.log(`  - URL Registry Routes: ${finalReg.rows[0].count}`);
  console.log(`  - Legacy WP Mappings: ${finalMap.rows[0].count}`);

  await client.end();
  console.log('\n🚀 ALL DONE SUCCESSFULLY!');
}

main().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
