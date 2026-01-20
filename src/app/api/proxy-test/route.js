import { NextResponse } from 'next/server';

export async function GET() {
  const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  try {
    console.log('[Proxy Test] Testing API proxy functionality');
    console.log('[Proxy Test] API_BASE_URL:', API_BASE_URL);
    
    if (!API_BASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'API_BASE_URL not configured',
        environment: {
          API_URL: process.env.API_URL ? 'SET' : 'NOT_SET',
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? 'SET' : 'NOT_SET',
          NODE_ENV: process.env.NODE_ENV
        }
      }, { status: 500 });
    }

    // Test backend connection
    const backendResponse = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const backendText = await backendResponse.text();
    
    // Test services endpoint
    const servicesResponse = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const servicesData = await servicesResponse.text();
    
    return NextResponse.json({
      success: true,
      message: 'Proxy test successful',
      tests: {
        backend: {
          url: API_BASE_URL,
          status: backendResponse.status,
          response: backendText.substring(0, 100)
        },
        services: {
          url: `${API_BASE_URL}/services`,
          status: servicesResponse.status,
          responseLength: servicesData.length,
          responsePreview: servicesData.substring(0, 200)
        }
      },
      environment: {
        API_URL: process.env.API_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NODE_ENV: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Proxy Test] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      apiBaseUrl: API_BASE_URL,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}