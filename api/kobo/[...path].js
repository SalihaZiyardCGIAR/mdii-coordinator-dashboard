// api/kobo/[...path].js
export default async function handler(req, res) {
  try {
    // Reconstruct the full path and query string
    const { path: pathSegments = [] } = req.query;
    const pathStr = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
    const queryString = req.url.split('?')[1] || ''; // Preserve query params (e.g., ?format=json)
    const koboUrl = `${import.meta.env.VITE_KOBO_URL}${pathStr}${queryString ? `?${queryString}` : ''}`;

    console.log('Proxying to KoBo:', req.method, koboUrl);
    console.log('Headers:', Object.fromEntries(Object.entries(req.headers).filter(([k]) => !k.startsWith('x-vercel-') && k !== 'host')));

    const fetchOptions = {
      method: req.method,
      headers: {
        'Authorization': `Token ${process.env.VITE_KOBO_API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
    };

    // Handle body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = req.body;
    }

    const response = await fetch(koboUrl, fetchOptions);

    console.log('KoBo response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('KoBo API error body:', errorText);
      return res.status(response.status).json({
        error: `KoBo API error: ${response.statusText}`,
        status: response.status,
        details: errorText,
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // Handle non-JSON (e.g., XML or text)
      const text = await response.text();
      res.status(response.status).setHeader('Content-Type', contentType || 'text/plain').send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Failed to proxy request to KoBo Toolbox', 
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase if needed for large responses
    },
  },
};