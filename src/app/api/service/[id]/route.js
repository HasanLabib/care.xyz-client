import { NextResponse } from 'next/server';

// Direct service details endpoint - public access
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://server-psi-lake-59.vercel.app';

export async function GET(request, { params }) {
  console.log('[Service Details] Starting request...');
  console.log('[Service Details] Service ID:', params.id);
  console.log('[Service Details] API_BASE_URL:', API_BASE_URL);
  
  // Check if we have a valid API URL
  if (!API_BASE_URL || API_BASE_URL.includes('localhost')) {
    console.error('[Service Details] Invalid or missing API_BASE_URL');
    return NextResponse.json({
      error: 'Environment Configuration Error',
      message: 'API_URL not properly configured in Vercel environment variables',
      currentApiUrl: API_BASE_URL,
    }, { status: 500 });
  }

  try {
    const targetUrl = `${API_BASE_URL}/service/${params.id}`;
    console.log('[Service Details] Target URL:', targetUrl);
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    console.log('[Service Details] Request options:', options);
    
    const response = await fetch(targetUrl, options);
    
    console.log('[Service Details] Response status:', response.status);
    console.log('[Service Details] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Service Details] Backend error:', errorText);
      
      // Handle 404 specifically
      if (response.status === 404) {
        return NextResponse.json({ 
          error: 'Service not found',
          message: 'The requested service does not exist'
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        error: 'Backend error', 
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        targetUrl: targetUrl
      }, { status: response.status });
    }
    
    const data = await response.text();
    console.log('[Service Details] Success! Data length:', data.length);
    console.log('[Service Details] Data preview:', data.substring(0, 100));
    
    // Forward response with proper headers
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    });
    
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('[Service Details] Network error:', error);
    console.error('[Service Details] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Network error', 
      message: error.message,
      name: error.name,
      targetUrl: `${API_BASE_URL}/service/${params.id}`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}