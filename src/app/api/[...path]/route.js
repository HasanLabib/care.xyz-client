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

export async function PATCH(request, { params }) {
  return handleRequest('PATCH', request, params);
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

    // Add body for POST/PUT/PATCH requests
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(targetUrl, options);
    const data = await response.text();

    // Properly handle Set-Cookie headers for cross-domain
    const responseHeaders = new Headers({
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    });

    // Forward all Set-Cookie headers (multiple cookies support)
    try {
      const setCookieHeaders = response.headers.getSetCookie?.() || [];
      if (setCookieHeaders.length > 0) {
        setCookieHeaders.forEach(cookie => {
          responseHeaders.append('Set-Cookie', cookie);
        });
      } else {
        // Fallback for older Node.js versions
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
          // Handle multiple cookies separated by comma
          const cookies = setCookie.split(',').map(c => c.trim());
          cookies.forEach(cookie => {
            responseHeaders.append('Set-Cookie', cookie);
          });
        }
      }
    } catch (error) {
      console.error('Cookie forwarding error:', error);
      // Fallback: try to get single cookie
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        responseHeaders.append('Set-Cookie', setCookie);
      }
    }

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}