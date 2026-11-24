/**
 * BharatBN™ WordPress XML to Supabase Staging ETL Parser
 * Mission FTC | Engine 7
 * Parses WordPress XML export file (32.6MB) and prepares:
 * 1. Staging JSON dumps
 * 2. Staging SQL inserts for PostgreSQL / Supabase
 * 3. Master Migration Inventory CSV (bharatbn_migration_inventory.csv)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const XML_PATH = path.join(__dirname, '../wp_export/bharatbn.xml');
const OUTPUT_DIR = path.join(__dirname, '../wp_export');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

function cleanCdata(raw) {
  if (!raw) return '';
  return raw.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
}

async function run() {
  console.log('🚀 Starting BharatBN WordPress XML Parser...');
  const startTime = Date.now();

  if (!fs.existsSync(XML_PATH)) {
    console.error(`❌ XML file not found at: ${XML_PATH}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(XML_PATH, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let inItem = false;
  let currentItemLines = [];
  let totalProcessed = 0;

  const listings = [];
  const attachments = [];
  const pages = [];
  const blogs = [];
  const inventoryRows = [];

  for await (const line of rl) {
    if (line.includes('<item>')) {
      inItem = true;
      currentItemLines = [line];
    } else if (line.includes('</item>') && inItem) {
      currentItemLines.push(line);
      inItem = false;
      totalProcessed++;

      const itemContent = currentItemLines.join('\n');
      parseItem(itemContent, {
        listings,
        attachments,
        pages,
        blogs,
        inventoryRows,
      });

      if (totalProcessed % 500 === 0) {
        console.log(`⏳ Processed ${totalProcessed} items...`);
      }
    } else if (inItem) {
      currentItemLines.push(line);
    }
  }

  console.log(`\n✅ Extraction Complete in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  console.log(`📊 Summary of Extracted Data:`);
  console.log(`   - Total Items Processed: ${totalProcessed}`);
  console.log(`   - Business Listings: ${listings.length}`);
  console.log(`   - Media Attachments: ${attachments.length}`);
  console.log(`   - Content Pages: ${pages.length}`);
  console.log(`   - Blog Articles: ${blogs.length}`);
  console.log(`   - Inventory Rows: ${inventoryRows.length}`);

  // 1. Write Staged JSON Files
  console.log('\n💾 Writing JSON staging files...');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'staged_listings.json'), JSON.stringify(listings, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'staged_media.json'), JSON.stringify(attachments, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'staged_pages.json'), JSON.stringify(pages, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'staged_blogs.json'), JSON.stringify(blogs, null, 2));

  // 2. Write Inventory CSV (SOP Phase 2 Deliverable)
  console.log('💾 Writing bharatbn_migration_inventory.csv...');
  const csvHeaders = [
    'Legacy WP ID',
    'Post Type',
    'Title',
    'Source URL',
    'Target Path',
    'City',
    'Phone',
    'Status',
    'Has Coordinates',
    'Owner System',
    'Migration State',
  ];
  const csvLines = [csvHeaders.join(',')];
  for (const row of inventoryRows) {
    csvLines.push(
      [
        row.id,
        `"${(row.type || '').replace(/"/g, '""')}"`,
        `"${(row.title || '').replace(/"/g, '""')}"`,
        `"${(row.sourceUrl || '').replace(/"/g, '""')}"`,
        `"${(row.targetPath || '').replace(/"/g, '""')}"`,
        `"${(row.city || '').replace(/"/g, '""')}"`,
        `"${(row.phone || '').replace(/"/g, '""')}"`,
        row.status,
        row.hasCoordinates,
        row.owner,
        row.state,
      ].join(',')
    );
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'bharatbn_migration_inventory.csv'), csvLines.join('\n'));

  // 3. Generate SQL Staging Inserts for Supabase
  console.log('💾 Generating PostgreSQL Staging SQL script (002_staged_listings.sql)...');
  generateStagingSql(listings, attachments, path.join(OUTPUT_DIR, '002_staged_listings.sql'));

  console.log('\n🎉 All deliverables successfully generated in database/wp_export/ !');
}

function parseItem(xml, stores) {
  const titleMatch = xml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || xml.match(/<title>([\s\S]*?)<\/title>/);
  const title = titleMatch ? cleanCdata(titleMatch[1]) : '';

  const linkMatch = xml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/) || xml.match(/<link>([\s\S]*?)<\/link>/);
  const link = linkMatch ? cleanCdata(linkMatch[1]) : '';

  const idMatch = xml.match(/<wp:post_id>(\d+)<\/wp:post_id>/);
  const id = idMatch ? parseInt(idMatch[1], 10) : 0;

  const postNameMatch = xml.match(/<wp:post_name><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_name>/) || xml.match(/<wp:post_name>([\s\S]*?)<\/wp:post_name>/);
  const postName = postNameMatch ? cleanCdata(postNameMatch[1]) : '';

  const postTypeMatch = xml.match(/<wp:post_type><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_type>/) || xml.match(/<wp:post_type>([\s\S]*?)<\/wp:post_type>/);
  const postType = postTypeMatch ? cleanCdata(postTypeMatch[1]) : 'post';

  const postStatusMatch = xml.match(/<wp:post_status><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_status>/) || xml.match(/<wp:post_status>([\s\S]*?)<\/wp:post_status>/);
  const postStatus = postStatusMatch ? cleanCdata(postStatusMatch[1]) : 'publish';

  const dateMatch = xml.match(/<wp:post_date><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_date>/) || xml.match(/<wp:post_date>([\s\S]*?)<\/wp:post_date>/);
  const postDate = dateMatch ? cleanCdata(dateMatch[1]) : null;

  const creatorMatch = xml.match(/<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/) || xml.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/);
  const creator = creatorMatch ? cleanCdata(creatorMatch[1]) : '';

  const contentMatch = xml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
  const content = contentMatch ? contentMatch[1] : '';

  const parentMatch = xml.match(/<wp:post_parent>(\d+)<\/wp:post_parent>/);
  const parentId = parentMatch ? parseInt(parentMatch[1], 10) : 0;

  const attachmentUrlMatch = xml.match(/<wp:attachment_url><!\[CDATA\[([\s\S]*?)\]\]><\/wp:attachment_url>/) || xml.match(/<wp:attachment_url>([\s\S]*?)<\/wp:attachment_url>/);
  const attachmentUrl = attachmentUrlMatch ? cleanCdata(attachmentUrlMatch[1]) : '';

  // Extract Categories
  const categoryMatches = [...xml.matchAll(/<category\s+domain="([^"]+)"\s+nicename="([^"]+)">([\s\S]*?)<\/category>/g)];
  const categories = categoryMatches.map((m) => ({
    domain: m[1],
    slug: m[2],
    name: cleanCdata(m[3]),
  }));

  // Extract Metadata
  const metaMap = {};
  const metaRegex = /<wp:meta_key><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_key>[\s\r\n]*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g;
  let metaMatch;
  while ((metaMatch = metaRegex.exec(xml)) !== null) {
    metaMap[metaMatch[1].trim()] = metaMatch[2].trim();
  }

  // Derive Normalized Fields
  const phone = metaMap['post_phone'] || '';
  const city = metaMap['post_city'] || metaMap['post_location'] || '';
  const address = metaMap['post_address'] || '';
  const lat = metaMap['post_latitude'] ? parseFloat(metaMap['post_latitude']) : null;
  const lng = metaMap['post_longitude'] ? parseFloat(metaMap['post_longitude']) : null;
  const thumbnailId = metaMap['_thumbnail_id'] ? parseInt(metaMap['_thumbnail_id'], 10) : null;

  const itemObj = {
    id,
    title,
    slug: postName,
    sourceUrl: link,
    type: postType,
    status: postStatus,
    date: postDate,
    creator,
    content,
    phone,
    city,
    address,
    latitude: isNaN(lat) ? null : lat,
    longitude: isNaN(lng) ? null : lng,
    thumbnailId,
    categories,
    seo: {
      title: metaMap['rank_math_title'] || '',
      description: metaMap['rank_math_description'] || '',
      focusKeyword: metaMap['rank_math_focus_keyword'] || '',
    },
    meta: metaMap,
  };

  // Route to specific stores
  if (postType === 'post') {
    stores.listings.push(itemObj);

    // Extract path from link e.g. https://bharatbn.com/urban-ladder/ -> /urban-ladder/
    let targetPath = link.replace(/^https?:\/\/[^\/]+/, '');
    if (!targetPath) targetPath = `/${postName}/`;

    stores.inventoryRows.push({
      id,
      type: 'listing',
      title,
      sourceUrl: link,
      targetPath,
      city,
      phone,
      status: postStatus,
      hasCoordinates: itemObj.latitude && itemObj.longitude ? 'YES' : 'NO',
      owner: 'wordpress', // default hybrid owner until cutover
      state: 'legacy',
    });
  } else if (postType === 'attachment') {
    stores.attachments.push({
      id,
      parentId,
      title,
      sourceUrl: attachmentUrl || link,
      filename: metaMap['_wp_attached_file'] || '',
      altText: metaMap['_wp_attachment_image_alt'] || '',
      mimeType: xml.match(/<wp:post_mime_type><!\[CDATA\[(.*?)\]\]><\/wp:post_mime_type>/)?.[1] || '',
    });
  } else if (postType === 'page') {
    stores.pages.push(itemObj);
    let targetPath = link.replace(/^https?:\/\/[^\/]+/, '');
    stores.inventoryRows.push({
      id,
      type: 'page',
      title,
      sourceUrl: link,
      targetPath,
      city,
      phone,
      status: postStatus,
      hasCoordinates: 'N/A',
      owner: 'wordpress',
      state: 'legacy',
    });
  } else if (postType === 'blog') {
    stores.blogs.push(itemObj);
    let targetPath = link.replace(/^https?:\/\/[^\/]+/, '');
    stores.inventoryRows.push({
      id,
      type: 'blog',
      title,
      sourceUrl: link,
      targetPath,
      city,
      phone,
      status: postStatus,
      hasCoordinates: 'N/A',
      owner: 'wordpress',
      state: 'legacy',
    });
  }
}

function generateStagingSql(listings, attachments, outPath) {
  const stream = fs.createWriteStream(outPath, { encoding: 'utf8' });

  stream.write(`-- BharatBN Staged Listings Import Script\n`);
  stream.write(`-- Generated automatically for Supabase PostgreSQL\n\n`);

  // Batch insert into migration_wp_listings
  const BATCH_SIZE = 100;
  for (let i = 0; i < listings.length; i += BATCH_SIZE) {
    const batch = listings.slice(i, i + BATCH_SIZE);
    stream.write(`INSERT INTO migration_wp_listings (\n`);
    stream.write(`  legacy_wp_id, source_url, post_title, post_name, post_type, post_status,\n`);
    stream.write(`  post_date, author_login, phone, city, address, latitude, longitude,\n`);
    stream.write(`  thumbnail_id, categories, raw_payload, migration_status\n`);
    stream.write(`) VALUES\n`);

    const valuesArr = batch.map((item) => {
      const catsJson = JSON.stringify(item.categories || []);
      const payloadJson = JSON.stringify({
        seo: item.seo,
        meta_sample: {
          views: item.meta['wpb_post_views_count'],
          price_plan: item.meta['popular_plan'],
        },
      });

      return `  (${item.id}, ${escapeSql(item.sourceUrl)}, ${escapeSql(item.title)}, ${escapeSql(
        item.slug
      )}, ${escapeSql(item.type)}, ${escapeSql(item.status)}, ${
        item.date ? escapeSql(item.date) : 'NULL'
      }, ${escapeSql(item.creator)}, ${escapeSql(item.phone)}, ${escapeSql(item.city)}, ${escapeSql(
        item.address
      )}, ${item.latitude !== null ? item.latitude : 'NULL'}, ${
        item.longitude !== null ? item.longitude : 'NULL'
      }, ${item.thumbnailId !== null ? item.thumbnailId : 'NULL'}, ${escapeSql(
        catsJson
      )}::jsonb, ${escapeSql(payloadJson)}::jsonb, 'pending')`;
    });

    stream.write(valuesArr.join(',\n'));
    stream.write(`\nON CONFLICT (legacy_wp_id) DO UPDATE SET\n`);
    stream.write(`  post_title = EXCLUDED.post_title,\n`);
    stream.write(`  phone = EXCLUDED.phone,\n`);
    stream.write(`  city = EXCLUDED.city,\n`);
    stream.write(`  address = EXCLUDED.address,\n`);
    stream.write(`  latitude = EXCLUDED.latitude,\n`);
    stream.write(`  longitude = EXCLUDED.longitude,\n`);
    stream.write(`  raw_payload = EXCLUDED.raw_payload;\n\n`);
  }

  // Populate url_registry defaults
  stream.write(`-- Seed initial url_registry for hybrid routing\n`);
  for (let i = 0; i < listings.length; i += BATCH_SIZE) {
    const batch = listings.slice(i, i + BATCH_SIZE);
    stream.write(`INSERT INTO url_registry (path, owner, migration_status, status_code, entity_type)\nVALUES\n`);
    const regValues = batch.map((item) => {
      let path = item.sourceUrl.replace(/^https?:\/\/[^\/]+/, '');
      if (!path) path = `/${item.slug}/`;
      return `  (${escapeSql(path)}, 'wordpress', 'legacy', 200, 'business')`;
    });
    stream.write(regValues.join(',\n'));
    stream.write(`\nON CONFLICT (path) DO NOTHING;\n\n`);
  }

  stream.end();
}

run().catch(console.error);
