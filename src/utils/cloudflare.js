const CLOUDFLARE_ACCOUNT_ID = process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_ACCESS_KEY = process.env.REACT_APP_CLOUDFLARE_ACCESS_KEY;

export const getCloudflareUrl = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${cleanPath}`;
};

export const fetchCloudflareContent = async (path) => {
  try {
    const response = await fetch(getCloudflareUrl(path), {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_ACCESS_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Error fetching from Cloudflare:', error);
    throw error;
  }
}; 