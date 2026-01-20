import { NextResponse } from 'next/server';

export async function GET() {
  const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';
  
  console.log('[Proxy Test] Starting proxy test...');
  console.log('[Proxy Test] API_BASE_URL:', API_BASE_URL);
  
  try {
    // Simulate the exact same request that the API proxy makes
    const path = ['services'];
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `${API_BASE_URL}/${pathString}`;
    
    console.log('[Proxy Test] Path array:', path);
    console.log('[Proxy Test] Path string:', pathString);
    console.log('[Proxy Test] Target URL:', targetUrl);
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    console.log('[Proxy Test] Making request with options:', JSON.stringify(options, null, 2));
    
    const response = await fetch(targetUrl, options);
    
    console.log('[Proxy Test] Response status:', response.status);
    console.log('[Proxy Test] Response ok:', response.ok);
    console.log('[Proxy Test] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Proxy Test] Error response:', errorText);
      
      return NextResponse.json({
        success: false,
        error: 'Backend returned error',
        status: response.status,
        statusText: response.statusText,
        errorResponse: errorText,
        targetUrl: targetUrl,
        timestamp: new Date().toISOString()
      }, { status: response.status });
    }
    
    const data = await response.text();
    console.log('[Proxy Test] Success! Response length:', data.length);
    console.log('[Proxy Test] Response preview:', data.substring(0, 100));
    
    return NextResponse.json({
      success: true,
      message: 'Proxy test successful',
      targetUrl: targetUrl,
      responseStatus: response.status,
      responseLength: data.length,
      responsePreview: data.substring(0, 200),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Proxy Test] Network error:', error);
    console.error('[Proxy Test] Error name:', error.name);
    console.error('[Proxy Test] Error message:', error.message);
    console.error('[Proxy Test] Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Network error',
      errorName: error.name,
      errorMessage: error.message,
      targetUrl: `${API_BASE_URL}/services`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}