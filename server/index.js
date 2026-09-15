import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'express_server',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// GitHub OAuth Redirect Endpoint
app.get('/api/auth/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  if (!clientId) {
    return res.json({
      message: 'GitHub OAuth Client ID is not configured.',
      instructions: 'Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env file.',
    });
  }

  const redirectUri = encodeURIComponent(`${appUrl}/api/auth/callback`);
  const scope = encodeURIComponent('read:user,repo');
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
});

// GitHub OAuth Callback Endpoint
app.get('/api/auth/callback', async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  if (!code) {
    return res.redirect(`${appUrl}/?auth=error&message=No+code+provided`);
  }

  if (!clientId || !clientSecret) {
    return res.redirect(`${appUrl}/?auth=error&message=OAuth+not+configured`);
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      return res.redirect(`${appUrl}/?auth=error&message=${encodeURIComponent(tokenData.error_description || 'Auth failed')}`);
    }

    const accessToken = tokenData.access_token;
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'CommitStreak-Monitor',
      },
    });
    const userData = await userRes.json();
    const username = userData.login || 'developer';

    return res.redirect(`${appUrl}/?auth=success&token=${accessToken}&username=${username}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect(`${appUrl}/?auth=error&message=Server+error+during+OAuth`);
  }
});

// User endpoint proxy
app.get('/api/github/user', async (req, res) => {
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
  if (pat && pat.trim() && pat.trim().length > 10) headers.Authorization = `token ${pat.trim()}`;

  try {
    let response = await fetch(`https://api.github.com/users/${targetUser}`, { headers });
    if (response.status === 401 && headers.Authorization) {
      delete headers.Authorization;
      response = await fetch(`https://api.github.com/users/${targetUser}`, { headers });
    }
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Repositories endpoint proxy
app.get('/api/github/repos', async (req, res) => {
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
  if (pat && pat.trim() && pat.trim().length > 10) headers.Authorization = `token ${pat.trim()}`;

  try {
    let response = await fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=100`, { headers });
    if (response.status === 401 && headers.Authorization) {
      delete headers.Authorization;
      response = await fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=100`, { headers });
    }
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Journal endpoint
app.get('/api/journal', (req, res) => {
  res.json({
    status: 'ok',
    storage: 'localStorage',
    message: 'Journal API ready.',
  });
});

app.listen(PORT, () => {
  console.log(`CommitStreak backend server listening on http://localhost:${PORT}`);
});
