// Vercel Serverless Function: GitHub OAuth Callback Handler
export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:5173');

  if (!code) {
    return res.redirect(302, `${appUrl}/?auth=error&message=No+code+provided`);
  }

  if (!clientId || !clientSecret) {
    return res.redirect(302, `${appUrl}/?auth=success&username=alexrivera-dev&demo=true`);
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
      return res.redirect(302, `${appUrl}/?auth=error&message=${encodeURIComponent(tokenData.error_description || 'Auth failed')}`);
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile to get username
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'CommitStreak-Monitor',
      },
    });

    const userData = await userResponse.json();
    const username = userData.login || 'developer';

    // Redirect to frontend with authenticated parameters
    return res.redirect(302, `${appUrl}/dashboard?auth=success&token=${accessToken}&username=${username}`);
  } catch (error) {
    console.error('OAuth exchange error:', error);
    return res.redirect(302, `${appUrl}/?auth=error&message=Server+error+during+OAuth`);
  }
}
