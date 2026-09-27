import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('collections').select('*').limit(1);
  if (error) {
    console.error('Error selecting from collections:', error);
  } else {
    console.log('Sample collection row keys:', Object.keys(data[0] || {}));
    console.log('Sample collection row:', data[0]);
  }
}

run();
