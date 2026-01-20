import { NextResponse } from 'next/server';

export async function GET() {
  // This endpoint will help us debug the live API proxy issue
  const timestamp = new Date().toISOString();
  
  try {
    // Test the actual API proxy endpoint from server-side
    const proxyResponse = await fetch('https://care-xyz-client.vercel.app/api/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const proxyText = await proxyResponse.text();
    
    return NextResponse.json({
      timestamp,
      message: 'Live API proxy test',
      proxyTest: {
        status: proxyResponse.status,
        ok: proxyResponse.ok,
        statusText: proxyResponse.statusText,
        headers: Object.fromEntries(proxyResponse.headers.entries()),
        responseLength: proxyText.length,
        responsePreview: proxyText.substring(0, 500),
        fullResponse: proxyText
      },
      diagnosis: proxyResponse.ok ? 'API proxy is working' : 'API proxy is failing'
    });
    
  } catch (error) {
    return NextResponse.json({
      timestamp,
      message: 'Live API proxy test failed',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
}