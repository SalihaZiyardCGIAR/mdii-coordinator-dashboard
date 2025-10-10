// api/kobo/[...path].js
export default async function handler(req, res) {
  const { path = [] } = req.query;
  const koboUrl = `https://kf.kobotoolbox.org/api/v2/${path.join('/')}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;

  console.log('Proxying to KoBo:', req.method, koboUrl); // Log for debugging

  try {
    const response = await fetch(koboUrl, {
      method: req.method,
      headers: {
        Authorization: 'Token fc37a9329918014ef595b183adcef745a4beb217',
        Accept: 'application/json',
        // Pass through relevant headers
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: req.method !== 'GET' && req.body ? req.body : undefined,
    });

    if (!response.ok) {
      console.error('KoBo API error:', response.status, response.statusText);
      return res.status(response.status).json({
        error: `KoBo API error: ${response.statusText}`,
        status: response.status,
      });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to proxy request to KoBo Toolbox', details: error.message });
  }
}

export const config = {
  api: {
    bodyParser: true, // Ensure body parsing for POST requests
  },
};