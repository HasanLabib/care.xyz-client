import { NextResponse } from 'next/server';

// Direct me endpoint to bypass the dynamic [...path] route
const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';

export async function GET(request) {
  console.log('[Direct Me] Starting request...');
  console.log('[Direct Me] API_BASE_URL:', API_BASE_URL);
  
  try {
    const targetUrl = `${API_BASE_URL}/me`;
    console.log('[Direct Me] Target URL:', targetUrl);
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward Authorization header if present
        ...(request.headers.get('authorization') && { 
          'Authorization': request.headers.get('authorization') 
        }),
        // Forward cookies from the request
        ...(request.headers.get('cookie') && { 
          'Cookie': request.headers.get('cookie') 
        }),
      },
    };
    
    console.log('[Direct Me] Request options:', options);
    console.log('[Direct Me] Request headers:', Object.fromEntries(request.headers.entries()));
    
    const response = await fetch(targetUrl, options);
    
    console.log('[Direct Me] Response status:', response.status);
    console.log('[Direct Me] Response ok:', response.ok);
    console.log('[Direct Me] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('[Direct Me] Response data:', data);
    
    // Forward response with proper headers including cookies
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    });
    
    // Forward Set-Cookie headers
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.append('Set-Cookie', setCookie);
    }
    
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('[Direct Me] Network error:', error);
    console.error('[Direct Me] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Network error', 
      message: error.message,
      name: error.name,
      targetUrl: `${API_BASE_URL}/me`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('[Direct Me] POST request starting...');
  const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';
  
  try {
    const targetUrl = `${API_BASE_URL}/me`;
    const body = await request.text();
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && { 
          'Authorization': request.headers.get('authorization') 
        }),
        ...(request.headers.get('cookie') && { 
          'Cookie': request.headers.get('cookie') 
        }),
      },
      body: body
    };
    
    const response = await fetch(targetUrl, options);
    const data = await response.text();
    
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    });
    
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      responseHeaders.append('Set-Cookie', setCookie);
    }
    
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('[Direct Me] POST error:', error);
    return NextResponse.json({ 
      error: 'Network error', 
      message: error.message 
    }, { status: 500 });
  }
}