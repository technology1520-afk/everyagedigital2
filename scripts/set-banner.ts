import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse command-line arguments: --slug <slug> --banner <path-or-url>
const args = process.argv.slice(2);
let slug = '';
let bannerInput = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--slug' && args[i + 1]) {
    slug = args[i + 1].trim();
    i++;
  } else if (args[i] === '--banner' && args[i + 1]) {
    bannerInput = args[i + 1].trim();
    i++;
  }
}

if (!slug || !bannerInput) {
  console.log(`
Usage:
  node --env-file=.env.local -r esbuild-register scripts/set-banner.ts --slug <slug> --banner <url-or-file-path>
  or
  npx tsx scripts/set-banner.ts --slug <slug> --banner <url-or-file-path>

Examples:
  npx tsx scripts/set-banner.ts --slug home-office-starter-kit --banner public/images/collections/calm-home-office-starter-kit-banner.jpg
  npx tsx scripts/set-banner.ts --slug home-office-starter-kit --banner https://wlfwdbusmzgdiryhtdki.supabase.co/storage/v1/object/public/collections/calm-home-office-starter-kit-banner.jpg
`);
  process.exit(1);
}

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

if (!supabaseKey) {
  console.error('[set-banner] Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log(`[set-banner] Processing banner for bundle slug: "${slug}"...`);
  let finalBannerUrl = bannerInput;

  // Check if bannerInput is a local file path
  const isLocalFile = fs.existsSync(bannerInput) || fs.existsSync(path.resolve(process.cwd(), bannerInput));
  if (isLocalFile) {
    const resolvedPath = fs.existsSync(bannerInput) ? bannerInput : path.resolve(process.cwd(), bannerInput);
    console.log(`[set-banner] Detected local file: ${resolvedPath}`);
    const fileBuffer = fs.readFileSync(resolvedPath);
    const ext = path.extname(resolvedPath).replace(/^\./, '') || 'jpg';
    const storageFilename = `${slug}-banner.${ext}`;

    console.log(`[set-banner] Uploading to Supabase Storage bucket 'collections' as '${storageFilename}'...`);
    
    // Ensure bucket exists
    try {
      await supabase.storage.createBucket('collections', { public: true });
    } catch {
      // bucket may already exist
    }

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('collections')
      .upload(storageFilename, fileBuffer, {
        contentType: ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
        upsert: true
      });

    if (uploadErr) {
      console.warn(`[set-banner] Supabase storage upload warning: ${uploadErr.message}`);
    } else {
      console.log(`[set-banner] Successfully uploaded to Supabase Storage:`, uploadData);
    }

    const { data: pubData } = supabase.storage.from('collections').getPublicUrl(storageFilename);
    finalBannerUrl = pubData.publicUrl;
    console.log(`[set-banner] Public CDN URL: ${finalBannerUrl}`);
  }

  // Update Supabase collections table
  console.log(`[set-banner] Updating collections table row where slug = '${slug}'...`);
  const { data: updatedRows, error: updateErr } = await supabase
    .from('collections')
    .update({ banner_image_url: finalBannerUrl })
    .eq('slug', slug)
    .select();

  if (updateErr) {
    if (updateErr.code === 'PGRST204' || updateErr.message.includes('banner_image_url')) {
      console.warn(`\n[set-banner] Notice: 'banner_image_url' column does not exist yet in live Supabase schema cache.`);
      console.warn(`Please run the migration in Supabase SQL Editor:`);
      console.warn(`  supabase/migrations/004_collections_banner_image.sql`);
      console.warn(`SQL:\n  ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_image_url TEXT;\n`);
    } else {
      console.error('[set-banner] Database update error:', updateErr);
    }
  } else {
    console.log(`[set-banner] Successfully updated collection in database:`, updatedRows);
  }

  console.log(`\n[set-banner] Summary:`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Banner URL: ${finalBannerUrl}`);
  console.log(`  Render Priority: banner_image_url (${finalBannerUrl}) -> image_url -> first item`);
}

main().catch(err => {
  console.error('[set-banner] Unexpected error:', err);
  process.exit(1);
});
