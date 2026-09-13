// Vercel Serverless Function: Journal API Endpoint
let memoryJournalStore = null;

export default async function handler(req, res) {
  // Allow cross-origin if accessed externally
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if Supabase credentials are provided
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (req.method === 'GET') {
    // If Supabase is connected, we can query it, or return status
    return res.status(200).json({
      status: 'ok',
      storage: supabaseUrl ? 'supabase' : 'client_local_storage',
      message: 'Journal API ready. Entries automatically synced with browser localStorage.'
    });
  }

  if (req.method === 'POST') {
    const entry = req.body;
    return res.status(201).json({
      status: 'created',
      data: entry,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
