import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Querying product for Halloween decor...');
  const { data: prods, error: prodErr } = await supabase
    .from('products')
    .select('id, slug, title, image_url')
    .ilike('title', '%50-Piece Halloween%')
    .limit(1);

  if (prodErr) {
    console.error('Error fetching product:', prodErr);
    process.exit(1);
  }

  let imageUrl = prods?.[0]?.image_url;
  console.log('Found product:', prods?.[0]);

  if (!imageUrl) {
    console.log('Searching for any Halloween product...');
    const { data: anyHalloween } = await supabase
      .from('products')
      .select('id, slug, title, image_url')
      .ilike('title', '%Halloween%')
      .limit(5);
    console.log('Halloween products:', anyHalloween);
    if (anyHalloween && anyHalloween.length > 0) {
      imageUrl = anyHalloween[0].image_url;
    }
  }

  if (!imageUrl) {
    console.error('Could not find image_url for Halloween product');
    process.exit(1);
  }

  console.log(`Updating collection 'halloween-house-family-kit' with cover_image: ${imageUrl}`);
  const { data: updated, error: updateErr } = await supabase
    .from('collections')
    .update({ cover_image: imageUrl })
    .eq('slug', 'halloween-house-family-kit')
    .select();

  if (updateErr) {
    console.error('Error updating collection:', updateErr);
    process.exit(1);
  }

  console.log('Successfully updated collection:', updated);
}

run();
