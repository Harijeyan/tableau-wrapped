export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response('Image URL is required', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Response(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response('Failed to fetch image', { status: 500 });
  }
} 