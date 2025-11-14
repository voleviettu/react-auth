// Mock user database
const users = [
  {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  }
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  // Extract user ID from token (mock validation)
  const match = token.match(/access_token_(\d+)_/);
  
  if (!match) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const userId = parseInt(match[1]);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
}
