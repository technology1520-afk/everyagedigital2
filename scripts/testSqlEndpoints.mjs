const url = 'https://wlfwdbusmzgdiryhtdki.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = `ALTER TABLE collections ADD COLUMN IF NOT EXISTS cover_image TEXT;`;

async function testEndpoints() {
  const endpoints = [
    `${url}/pg/query`,
    `${url}/database/query`,
    `${url}/sql`,
    `https://api.supabase.com/v1/projects/wlfwdbusmzgdiryhtdki/database/query`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({ query: sql, sql: sql })
      });
      console.log(ep, res.status, await res.text());
    } catch (e) {
      console.log(ep, 'Error:', e.message);
    }
  }
}

testEndpoints();
