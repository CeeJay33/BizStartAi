const BACKEND = 'http://104.236.237.164:8080';

export default async function handler(req, res) {
  // Ensure trailing slash (Django requires it)
  let path = req.url;

  // Remove query string temporarily
  const queryIndex = path.indexOf('?');
  let query = '';
  if (queryIndex !== -1) {
    query = path.substring(queryIndex);
    path = path.substring(0, queryIndex);
  }

  // Add trailing slash if missing
  if (!path.endsWith('/')) {
    path = path + '/';
  }

  const targetUrl = `${BACKEND}${path}${query}`;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Forward body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
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
      attempted_url: targetUrl,
    });
  }
}
