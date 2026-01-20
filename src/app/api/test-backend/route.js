import { NextResponse } from 'next/server';

export async function GET() {
  const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';
  
  try {
    console.log('[Test] Attempting to fetch from:', `${API_BASE_URL}/services`);
    
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('[Test] Response status:', response.status);
    console.log('[Test] Response ok:', response.ok);
    
    const data = await response.text();
    console.log('[Test] Response data length:', data.length);
    
    return NextResponse.json({
      success: true,
      backendUrl: `${API_BASE_URL}/services`,
      status: response.status,
      ok: response.ok,
      dataLength: data.length,
      data: data.substring(0, 200) + (data.length > 200 ? '...' : ''),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Test] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      backendUrl: `${API_BASE_URL}/services`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}