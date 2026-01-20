import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';

export async function GET(request, { params }) {
  return handleRequest('GET', request, params);
}

export async function POST(request, { params }) {
  return handleRequest('POST', request, params);
}

export async function PUT(request, { params }) {
  return handleRequest('PUT', request, params);
}

export async function DELETE(request, { params }) {
  return handleRequest('DELETE', request, params);
}

async function handleRequest(method, request, { params }) {
  const { path } = params;
  const url = new URL(request.url);
  
  // Build the target URL
  const targetUrl = `${API_BASE_URL}/${path.join('/')}${url.search}`;
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from the request
        ...(request.headers.get('cookie') && { 
          'Cookie': request.headers.get('cookie') 
        }),
      },
    };

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(targetUrl, options);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        // Forward Set-Cookie headers
        ...(response.headers.get('set-cookie') && {
          'Set-Cookie': response.headers.get('set-cookie')
        }),
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}