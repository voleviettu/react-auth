// Store for refresh tokens (in production, use a database)
const refreshTokens = new Map();

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  // Extract user ID from token (mock validation)
  const match = refreshToken.match(/refresh_token_(\d+)_/);
  
  if (!match) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  const userId = parseInt(match[1]);
  
  // Generate new tokens
  const newAccessToken = `access_token_${userId}_${Date.now()}`;
  const newRefreshToken = `refresh_token_${userId}_${Date.now()}`;

  return res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
}
