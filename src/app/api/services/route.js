import { NextResponse } from 'next/server';

// Direct services endpoint to bypass the dynamic [...path] route
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://server-psi-lake-59.vercel.app';

export async function GET(request) {
  console.log('[Direct Services] Starting request...');
  console.log('[Direct Services] API_URL:', process.env.API_URL);
  console.log('[Direct Services] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('[Direct Services] Final API_BASE_URL:', API_BASE_URL);
  
  // Check if we have a valid API URL
  if (!API_BASE_URL || API_BASE_URL.includes('localhost')) {
    console.error('[Direct Services] Invalid or missing API_BASE_URL');
    return NextResponse.json({
      error: 'Environment Configuration Error',
      message: 'API_URL not properly configured in Vercel environment variables',
      currentApiUrl: API_BASE_URL,
      envVars: {
        API_URL: process.env.API_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
      },
      instructions: 'Set API_URL=https://server-psi-lake-59.vercel.app in Vercel dashboard and redeploy'
    }, { status: 500 });
  }
  
  try {
    const targetUrl = `${API_BASE_URL}/services`;
    console.log('[Direct Services] Target URL:', targetUrl);
    
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
    
    console.log('[Direct Services] Request options:', options);
    
    const response = await fetch(targetUrl, options);
    
    console.log('[Direct Services] Response status:', response.status);
    console.log('[Direct Services] Response ok:', response.ok);
    console.log('[Direct Services] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Direct Services] Backend error:', errorText);
      return NextResponse.json({ 
        error: 'Backend error', 
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        targetUrl: targetUrl
      }, { status: response.status });
    }
    
    const data = await response.text();
    console.log('[Direct Services] Success! Data length:', data.length);
    console.log('[Direct Services] Data preview:', data.substring(0, 100));
    
    // Forward response with proper headers
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    });
    
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('[Direct Services] Network error:', error);
    console.error('[Direct Services] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: 'Network error', 
      message: error.message,
      name: error.name,
      targetUrl: `${API_BASE_URL}/services`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}