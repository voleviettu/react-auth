import { http, HttpResponse, delay } from 'msw';

// Mock user database
const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

// Store for refresh tokens
const refreshTokens = new Map();

// Generate mock JWT tokens
const generateAccessToken = (userId) => {
  return `access_token_${userId}_${Date.now()}`;
};

const generateRefreshToken = (userId) => {
  return `refresh_token_${userId}_${Date.now()}`;
};

export const handlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500); // Simulate network delay

    const { email, password } = await request.json();

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    refreshTokens.set(refreshToken, user.id);

    return HttpResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  }),

  // Refresh token endpoint
  http.post('/api/auth/refresh', async ({ request }) => {
    await delay(300);

    const { refreshToken } = await request.json();

    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      return HttpResponse.json(
        { message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const userId = refreshTokens.get(refreshToken);
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    // Remove old refresh token and store new one
    refreshTokens.delete(refreshToken);
    refreshTokens.set(newRefreshToken, userId);

    return HttpResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  }),

  // Logout endpoint
  http.post('/api/auth/logout', async ({ request }) => {
    await delay(200);

    const { refreshToken } = await request.json();

    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // Get current user endpoint (protected)
  http.get('/api/user/me', async ({ request }) => {
    await delay(300);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Extract user ID from token (mock validation)
    const match = token.match(/access_token_(\d+)_/);
    
    if (!match) {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = parseInt(match[1]);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  }),

  // Get protected data endpoint
  http.get('/api/data/protected', async ({ request }) => {
    await delay(400);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      message: 'This is protected data',
      data: [
        { id: 1, title: 'Protected Item 1', description: 'Secret content 1' },
        { id: 2, title: 'Protected Item 2', description: 'Secret content 2' },
        { id: 3, title: 'Protected Item 3', description: 'Secret content 3' }
      ],
      timestamp: new Date().toISOString()
    });
  })
];
