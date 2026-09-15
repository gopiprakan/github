// Vercel Serverless Function: GitHub User Proxy
export default async function handler(req, res) {
  const { username } = req.query;
  const targetUser = username || process.env.VITE_DEFAULT_GITHUB_USERNAME;
  if (!targetUser) {
    return res.status(400).json({ error: 'Username parameter is required.' });
  }

  const pat = process.env.GITHUB_PAT;

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'CommitStreak-Monitor',
  };

  if (pat && pat.trim() && pat.trim().length > 10) {
    headers.Authorization = `token ${pat.trim()}`;
  }

  try {
    let response = await fetch(`https://api.github.com/users/${targetUser}`, { headers });
    if (response.status === 401 && headers.Authorization) {
      delete headers.Authorization;
      response = await fetch(`https://api.github.com/users/${targetUser}`, { headers });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `GitHub returned status ${response.status}`,
        user: targetUser,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
