// Vercel Serverless Function: GitHub Repositories Proxy
export default async function handler(req, res) {
  const { username } = req.query;
  const targetUser = username || process.env.VITE_DEFAULT_GITHUB_USERNAME || 'alexrivera-dev';
  const pat = process.env.GITHUB_PAT;

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'CommitStreak-Monitor',
  };

  if (pat) {
    headers.Authorization = `token ${pat}`;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=30`, { headers });
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
