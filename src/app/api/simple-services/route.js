import { NextResponse } from 'next/server';

// Simple version of services endpoint to test if the issue is with our complex proxy logic
export async function GET() {
  const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';
  
  console.log('[Simple Services] Starting request...');
  console.log('[Simple Services] API_BASE_URL:', API_BASE_URL);
  
  try {
    const targetUrl = `${API_BASE_URL}/services`;
    console.log('[Simple Services] Target URL:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[Simple Services] Response status:', response.status);
    console.log('[Simple Services] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Simple Services] Backend error:', errorText);
      return NextResponse.json({ error: 'Backend error', details: errorText }, { status: response.status });
    }
    
    const data = await response.text();
    console.log('[Simple Services] Success! Data length:', data.length);
    
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('[Simple Services] Error:', error);
    return NextResponse.json({ 
      error: 'Network error', 
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}