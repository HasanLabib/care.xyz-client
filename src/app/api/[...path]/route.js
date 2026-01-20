import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL;

if (!API_BASE_URL) {
  throw new Error('API_URL environment variable is required');
}

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
  try {
    const { path } = params;
    const url = new URL(request.url);
    
    // Validate params
    if (!path) {
      console.error('[API Proxy] No path provided in params');
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }
    
    // Build the target URL - ensure path is properly joined
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `${API_BASE_URL}/${pathString}${url.search}`;
    
    // Log the request for debugging
    console.log(`[API Proxy] ${method} ${targetUrl}`);
    console.log(`[API Proxy] API_BASE_URL: ${API_BASE_URL}`);
    console.log(`[API Proxy] Path array:`, path);
    console.log(`[API Proxy] Path string:`, pathString);
    console.log(`[API Proxy] Full URL object:`, {
      pathname: url.pathname,
      search: url.search,
      origin: url.origin
    });

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
      try {
        const body = await request.text();
        if (body) {
          options.body = body;
        }
      } catch (bodyError) {
        console.error('[API Proxy] Error reading request body:', bodyError);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
      }
    }

    console.log(`[API Proxy] Making request to:`, targetUrl);
    console.log(`[API Proxy] Request options:`, {
      method: options.method,
      headers: options.headers,
      hasBody: !!options.body
    });

    const response = await fetch(targetUrl, options);
    
    console.log(`[API Proxy] Response status: ${response.status}`);
    console.log(`[API Proxy] Response ok: ${response.ok}`);
    
    if (!response.ok) {
      console.error(`[API Proxy] Backend error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`[API Proxy] Error response:`, errorText);
      
      return NextResponse.json(
        { 
          error: 'Backend Error', 
          status: response.status,
          statusText: response.statusText,
          message: errorText,
          targetUrl: targetUrl
        },
        { status: response.status }
      );
    }

    const data = await response.text();
    console.log(`[API Proxy] Success response length:`, data.length);

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
      console.error('[API Proxy] Cookie forwarding error:', error);
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
    console.error('[API Proxy] Network Error:', error);
    console.error('[API Proxy] Target URL was:', targetUrl);
    console.error('[API Proxy] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return sanitized error message for production
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable', 
        message: 'Please try again later',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}