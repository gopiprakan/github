// Vercel Serverless Function: GitHub OAuth Initialization
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const appUrl = process.env.APP_URL || (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173');

  if (!clientId) {
    return res.status(200).json({
      message: 'GitHub OAuth Client ID is not configured yet.',
      instructions: 'Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your Vercel project environment variables.',
      demoModeActive: true,
    });
  }

  const redirectUri = encodeURIComponent(`${appUrl}/api/auth/callback`);
  const scope = encodeURIComponent('read:user,repo');
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(302, githubAuthUrl);
}
