const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

export async function getAuthCode(email?: string) {
  const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.appdata',
  ];
  const redirectUri = browser.identity.getRedirectURL();
  // eslint-disable-next-line prefer-template
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    + `?client_id=${CLIENT_ID}`
    + `&redirect_uri=${encodeURIComponent(redirectUri)}`
    + `&response_type=code`
    + `&scope=${encodeURIComponent(SCOPES.join(' '))}`
    + `&access_type=offline`
    + `&prompt=consent`
    + (email ? `&login_hint=${encodeURIComponent(email)}` : '');

  const redirectedUrl = await browser.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  });
  if (!redirectedUrl) {
    throw new Error('Authentication failed: No response received');
  }

  const params = new URL(redirectedUrl.replace('#', '?')).searchParams;
  if (params.has('error')) {
    throw new Error(`Authentication error: ${params.get('error')}`);
  }

  return params.get('code')!;
}

export async function getTokens(authCode: string) {
  const url = 'https://www.googleapis.com/oauth2/v4/token';
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: browser.identity.getRedirectURL(),
  };

  const response = await fetch(url, { method: 'POST', body: JSON.stringify(params) });
  const result = await response.json();

  return {
    accessToken: result.access_token as string,
    expiresIn: result.expires_in as number,
    refreshToken: result.refresh_token as string,
  };
}

export function getTokenExpiration(expirationSec: number) {
  const currentTimeMs = Date.now();
  return currentTimeMs + expirationSec * 1000;
}

export async function getEmail(accessToken: string) {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;
  const response = await fetch(url);
  const result = await response.json();
  return result.email as string;
}

export async function refreshAccessToken(refreshToken: string) {
  const url = 'https://www.googleapis.com/oauth2/v4/token';
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  };

  const response = await fetch(url, { method: 'POST', body: JSON.stringify(params) });
  const result = await response.json();

  return {
    accessToken: result.access_token as string,
    expiresIn: result.expires_in as number,
  };
}

export async function revokeToken(token: string) {
  const params = { token };
  await fetch('https://oauth2.googleapis.com/revoke', { method: 'POST', body: JSON.stringify(params) });
}
