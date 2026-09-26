import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

if (!supabaseKey) {
  console.error('[cleanupBundles] Error: SUPABASE_SERVICE_ROLE_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('[cleanupBundles] Connecting to Supabase at:', supabaseUrl);

  // 1. Fetch all products
  const { data: products, error: pErr } = await supabase
    .from('products')
    .select('id, slug, status');

  if (pErr) {
    console.error('[cleanupBundles] Error fetching products:', pErr.message);
    process.exit(1);
  }

  const allProductIds = new Set((products || []).map(p => p.id));
  const activeProductIds = new Set((products || []).filter(p => p.status === 'active').map(p => p.id));

  console.log(`[cleanupBundles] Total products in DB: ${products.length} (Active: ${activeProductIds.size})`);

  // 2. Clean collection_products join table if exists
  try {
    const { data: cpRows, error: cpErr } = await supabase
      .from('collection_products')
      .select('*');

    if (!cpErr && Array.isArray(cpRows)) {
      console.log(`[cleanupBundles] Total rows in collection_products: ${cpRows.length}`);
      
      // Identify orphaned rows (product_id NOT IN products)
      const orphaned = cpRows.filter(row => !allProductIds.has(row.product_id));
      console.log(`[cleanupBundles] Found ${orphaned.length} orphaned rows in collection_products`);

      for (const row of orphaned) {
        const { error: delErr } = await supabase
          .from('collection_products')
          .delete()
          .eq('collection_id', row.collection_id)
          .eq('product_id', row.product_id);
        if (delErr) {
          console.warn(`[cleanupBundles] Failed to delete orphaned row (${row.collection_id}, ${row.product_id}):`, delErr.message);
        } else {
          console.log(`[cleanupBundles] Deleted orphaned row (${row.collection_id}, ${row.product_id})`);
        }
      }
    } else if (cpErr) {
      console.log('[cleanupBundles] collection_products check:', cpErr.message);
    }
  } catch (err) {
    console.warn('[cleanupBundles] Error accessing collection_products:', err);
  }

  // 3. Clean collections table product_ids JSONB array
  try {
    const { data: collections, error: cErr } = await supabase
      .from('collections')
      .select('id, slug, title, product_ids, status');

    if (!cErr && Array.isArray(collections)) {
      console.log(`[cleanupBundles] Found ${collections.length} collections in DB:`);
      for (const col of collections) {
        const rawIds = Array.isArray(col.product_ids) ? col.product_ids : [];
        const validIds = rawIds.filter(id => allProductIds.has(id));
        const activeIds = rawIds.filter(id => activeProductIds.has(id));
        console.log(` - "${col.title}" (${col.slug}): total IDs = ${rawIds.length}, existing in DB = ${validIds.length}, active = ${activeIds.length}`);

        if (validIds.length !== rawIds.length) {
          console.log(`   -> Updating "${col.slug}" product_ids: removed ${rawIds.length - validIds.length} non-existent product IDs.`);
          await supabase
            .from('collections')
            .update({ product_ids: validIds })
            .eq('id', col.id);
        }
      }
    } else if (cErr) {
      console.error('[cleanupBundles] Error fetching collections:', cErr.message);
    }
  } catch (err) {
    console.error('[cleanupBundles] Exception cleaning collections:', err);
  }

  console.log('[cleanupBundles] Cleanup completed successfully.');
}

main().catch(console.error);
