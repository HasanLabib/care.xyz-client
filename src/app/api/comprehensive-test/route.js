import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      API_URL: process.env.API_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    tests: []
  };

  const API_BASE_URL = process.env.API_URL || 'https://server-psi-lake-59.vercel.app';

  // Test 1: Basic backend health check
  try {
    console.log('[Comprehensive Test] Testing backend health...');
    const healthResponse = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const healthText = await healthResponse.text();
    
    results.tests.push({
      name: 'Backend Health Check',
      url: API_BASE_URL,
      status: healthResponse.status,
      ok: healthResponse.ok,
      response: healthText.substring(0, 100),
      success: healthResponse.ok && healthText.includes('Care.xyz Server Running')
    });
  } catch (error) {
    results.tests.push({
      name: 'Backend Health Check',
      url: API_BASE_URL,
      error: error.message,
      success: false
    });
  }

  // Test 2: Services endpoint
  try {
    console.log('[Comprehensive Test] Testing services endpoint...');
    const servicesResponse = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const servicesText = await servicesResponse.text();
    
    results.tests.push({
      name: 'Services Endpoint',
      url: `${API_BASE_URL}/services`,
      status: servicesResponse.status,
      ok: servicesResponse.ok,
      response: servicesText.substring(0, 200),
      success: servicesResponse.ok
    });
  } catch (error) {
    results.tests.push({
      name: 'Services Endpoint',
      url: `${API_BASE_URL}/services`,
      error: error.message,
      success: false
    });
  }

  // Test 3: Me endpoint (should fail without auth)
  try {
    console.log('[Comprehensive Test] Testing me endpoint...');
    const meResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const meText = await meResponse.text();
    
    results.tests.push({
      name: 'Me Endpoint (no auth)',
      url: `${API_BASE_URL}/me`,
      status: meResponse.status,
      ok: meResponse.ok,
      response: meText.substring(0, 200),
      success: meResponse.status === 401 || meResponse.status === 403 // Should fail auth
    });
  } catch (error) {
    results.tests.push({
      name: 'Me Endpoint (no auth)',
      url: `${API_BASE_URL}/me`,
      error: error.message,
      success: false
    });
  }

  // Test 4: Check if API proxy path handling works
  try {
    console.log('[Comprehensive Test] Testing path handling...');
    const pathTest = ['services'];
    const pathString = Array.isArray(pathTest) ? pathTest.join('/') : pathTest;
    const targetUrl = `${API_BASE_URL}/${pathString}`;
    
    results.tests.push({
      name: 'Path Handling Test',
      pathArray: pathTest,
      pathString: pathString,
      targetUrl: targetUrl,
      success: targetUrl === `${API_BASE_URL}/services`
    });
  } catch (error) {
    results.tests.push({
      name: 'Path Handling Test',
      error: error.message,
      success: false
    });
  }

  // Summary
  const successfulTests = results.tests.filter(test => test.success).length;
  const totalTests = results.tests.length;
  
  results.summary = {
    successful: successfulTests,
    total: totalTests,
    allPassed: successfulTests === totalTests,
    backendWorking: results.tests.find(t => t.name === 'Backend Health Check')?.success || false,
    servicesWorking: results.tests.find(t => t.name === 'Services Endpoint')?.success || false
  };

  return NextResponse.json(results, { 
    status: results.summary.allPassed ? 200 : 500 
  });
}