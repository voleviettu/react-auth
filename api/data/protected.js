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

  return res.status(200).json({
    message: 'This is protected data',
    data: [
      { id: 1, title: 'Protected Item 1', description: 'Secret content 1' },
      { id: 2, title: 'Protected Item 2', description: 'Secret content 2' },
      { id: 3, title: 'Protected Item 3', description: 'Secret content 3' }
    ],
    timestamp: new Date().toISOString()
  });
}
