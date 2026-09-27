import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://wlfwdbusmzgdiryhtdki.supabase.co')
  .replace(/^["']|["']$/g, '')
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  const rpcs = ['exec_sql', 'exec', 'execute_sql', 'sql', 'run_sql'];
  for (const r of rpcs) {
    const { data, error } = await supabase.rpc(r, { sql: 'SELECT 1;' });
    console.log(`RPC ${r}:`, error ? error.message : 'SUCCESS', data);
  }
}

testRpc();
