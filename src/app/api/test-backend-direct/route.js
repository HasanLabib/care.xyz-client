import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = 'https://server-psi-lake-59.vercel.app';
  
  try {
    console.log('[Backend Test] Testing direct connection to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[Backend Test] Response status:', response.status);
    const text = await response.text();
    console.log('[Backend Test] Response text:', text);
    
    return NextResponse.json({
      success: true,
      backendUrl: backendUrl,
      status: response.status,
      response: text,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Backend Test] Error:', error);
    
    return NextResponse.json({
      success: false,
      backendUrl: backendUrl,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}