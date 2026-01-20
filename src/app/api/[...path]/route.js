import { NextResponse } from 'next/server';

// Get API URL from environment - no hardcoded fallback for production safety
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

// Log the API URL for debugging
console.log('[API Proxy] API_BASE_URL configured as:', API_BASE_URL);

export async function GET(request, context) {
  return handleRequest('GET', request, context);
}

export async function POST(request, context) {
  return handleRequest('POST', request, context);
}

export async function PUT(request, context) {
  return handleRequest('PUT', request, context);
}

export async function DELETE(request, context) {
  return handleRequest('DELETE', request, context);
}

export async function PATCH(request, context) {
  return handleRequest('PATCH', request, context);
}

async function handleRequest(method, request, context) {
  try {
    // Validate API_BASE_URL first
    if (!API_BASE_URL) {
      console.error('[API Proxy] API_BASE_URL is not configured');
      console.error('[API Proxy] Environment check:', {
        API_URL: process.env.API_URL ? 'SET' : 'NOT_SET',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? 'SET' : 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV
      });
      return NextResponse.json(
        { 
          error: 'API configuration error',
          message: 'Backend service is not properly configured',
          debug: {
            API_URL: process.env.API_URL ? 'SET' : 'NOT_SET',
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? 'SET' : 'NOT_SET'
          }
        },
        { status: 500 }
      );
    }

    // Safely extract params with fallback
    const params = context?.params || {};
    const { path } = params;
    const url = new URL(request.url);
    
    console.log('[API Proxy] Debug context:', {
      hasContext: !!context,
      hasParams: !!context?.params,
      path: path,
      pathType: typeof path,
      isArray: Array.isArray(path)
    });
    
    // Validate params
    if (!path) {
      console.error('[API Proxy] No path provided in params');
      console.error('[API Proxy] Context received:', context);
      console.error('[API Proxy] URL pathname:', url.pathname);
      
      // Try to extract path from URL as fallback
      const urlPath = url.pathname.replace('/api/', '');
      if (urlPath) {
        console.log('[API Proxy] Using URL path as fallback:', urlPath);
        const pathString = urlPath;
        const targetUrl = `${API_BASE_URL}/${pathString}${url.search}`;
        
        console.log(`[API Proxy] Fallback ${method} ${targetUrl}`);
        
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

        const response = await fetch(targetUrl, options);
        
        console.log(`[API Proxy] Fallback response status: ${response.status}`);
        
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
        console.log(`[API Proxy] Fallback success response length:`, data.length);

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
      }
      
      return NextResponse.json({ 
        error: 'No path provided',
        debug: {
          context: context,
          urlPathname: url.pathname,
          hasParams: !!context?.params
        }
      }, { status: 400 });
    }
    
    // Build the target URL - ensure path is properly joined
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `${API_BASE_URL}/${pathString}${url.search}`;
    
    // Log the request for debugging
    console.log(`[API Proxy] ${method} ${targetUrl}`);
    console.log(`[API Proxy] API_BASE_URL: ${API_BASE_URL}`);
    console.log(`[API Proxy] Path array:`, path);
    console.log(`[API Proxy] Path string:`, pathString);

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
    console.error('[API Proxy] API_BASE_URL was:', API_BASE_URL);
    console.error('[API Proxy] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 500) // Truncate stack trace
    });
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'API Proxy Network Error',
        message: error.message,
        apiBaseUrl: API_BASE_URL,
        errorName: error.name,
        timestamp: new Date().toISOString(),
        debug: 'Check Vercel function logs for more details'
      },
      { status: 500 }
    );
  }
}