// api/kobo/[...path].js
export default async function handler(req, res) {
  const { path = [] } = req.query; // Get the path segments
  const koboUrl = `https://kf.kobotoolbox.org/api/v2/${path.join('/')}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

  try {
    const response = await fetch(koboUrl, {
      method: req.method,
      headers: {
        'Authorization': 'Token fc37a9329918014ef595b183adcef745a4beb217',
        'Accept': 'application/json',
        ...req.headers,
        // Avoid passing Vercel-specific headers
        host: undefined,
        'x-vercel-id': undefined,
        'x-vercel-forwarded-for': undefined,
      },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to proxy request to KoBo Toolbox' });
  }
}