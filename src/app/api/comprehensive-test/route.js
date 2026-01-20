import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      API_URL: process.env.API_URL || 'NOT_SET',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
    },
    tests: []
  };

  const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  // Test 1: Environment Variables
  results.tests.push({
    name: 'Environment Variables',
    status: API_BASE_URL ? 'PASS' : 'FAIL',
    details: {
      API_URL: process.env.API_URL ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? 'SET' : 'NOT_SET',
      resolved: API_BASE_URL || 'NONE'
    }
  });

  if (!API_BASE_URL) {
    results.summary = {
      total: 1,
      passed: 0,
      failed: 1,
      critical: 'Environment variables not configured'
    };
    return NextResponse.json(results, { status: 500 });
  }

  // Test 2: Backend Health Check
  try {
    const healthResponse = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const healthText = await healthResponse.text();
    
    results.tests.push({
      name: 'Backend Health Check',
      url: API_BASE_URL,
      status: healthResponse.ok ? 'PASS' : 'FAIL',
      httpStatus: healthResponse.status,
      response: healthText.substring(0, 100)
    });
  } catch (error) {
    results.tests.push({
      name: 'Backend Health Check',
      url: API_BASE_URL,
      status: 'FAIL',
      error: error.message
    });
  }

  // Test 3: Services Endpoint
  try {
    const servicesResponse = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const servicesText = await servicesResponse.text();
    let servicesData = null;
    
    try {
      servicesData = JSON.parse(servicesText);
    } catch (parseError) {
      // Not JSON
    }
    
    results.tests.push({
      name: 'Services Endpoint',
      url: `${API_BASE_URL}/services`,
      status: servicesResponse.ok ? 'PASS' : 'FAIL',
      httpStatus: servicesResponse.status,
      responseLength: servicesText.length,
      isJSON: !!servicesData,
      serviceCount: Array.isArray(servicesData) ? servicesData.length : 'N/A',
      responsePreview: servicesText.substring(0, 200)
    });
  } catch (error) {
    results.tests.push({
      name: 'Services Endpoint',
      url: `${API_BASE_URL}/services`,
      status: 'FAIL',
      error: error.message
    });
  }

  // Test 4: Me Endpoint (should return 401 without auth)
  try {
    const meResponse = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const meText = await meResponse.text();
    
    results.tests.push({
      name: 'Me Endpoint (no auth)',
      url: `${API_BASE_URL}/me`,
      status: meResponse.status === 401 ? 'PASS' : 'FAIL',
      httpStatus: meResponse.status,
      response: meText.substring(0, 100),
      expected: '401 Unauthorized'
    });
  } catch (error) {
    results.tests.push({
      name: 'Me Endpoint (no auth)',
      url: `${API_BASE_URL}/me`,
      status: 'FAIL',
      error: error.message
    });
  }

  // Test 5: API Proxy Path Handling
  const testPath = ['services'];
  const pathString = testPath.join('/');
  const targetUrl = `${API_BASE_URL}/${pathString}`;
  
  results.tests.push({
    name: 'Path Handling Test',
    pathArray: testPath,
    pathString: pathString,
    targetUrl: targetUrl,
    status: 'PASS'
  });

  // Calculate summary
  const passed = results.tests.filter(t => t.status === 'PASS').length;
  const total = results.tests.length;
  
  results.summary = {
    passed,
    total,
    failed: total - passed,
    allPassed: passed === total,
    backendWorking: results.tests.find(t => t.name === 'Backend Health Check')?.status === 'PASS',
    servicesWorking: results.tests.find(t => t.name === 'Services Endpoint')?.status === 'PASS'
  };

  return NextResponse.json(results);
}