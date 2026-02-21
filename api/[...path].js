const BACKEND = 'http://104.236.237.164:8080';

export default async function handler(req, res) {
  // /api/query/ stays as /api/query/
  // /api/stats/ stays as /api/stats/
  const targetUrl = `${BACKEND}${req.url}`;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  try {
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(502).json({
      error: 'Backend unavailable',
      message: error.message,
    });
  }
}
