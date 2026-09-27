const url = 'https://wlfwdbusmzgdiryhtdki.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function check() {
  const sql = `ALTER TABLE collections ADD COLUMN IF NOT EXISTS cover_image TEXT;`;
  
  // Try supabase project sql endpoint
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      }
    });
    console.log('Rest root status:', res.status);
    const text = await res.text();
    console.log('Swagger definitions keys:', Object.keys(JSON.parse(text).definitions || {}));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

check();
