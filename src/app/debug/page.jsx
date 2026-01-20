'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
    const [envData, setEnvData] = useState(null);
    const [testData, setTestData] = useState(null);
    const [proxyData, setProxyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const runTests = async () => {
            try {
                // Test environment variables
                const envResponse = await fetch('/api/debug-env');
                const envResult = await envResponse.json();
                setEnvData(envResult);

                // Test comprehensive functionality
                const testResponse = await fetch('/api/comprehensive-test');
                const testResult = await testResponse.json();
                setTestData(testResult);

                // Test proxy functionality
                const proxyResponse = await fetch('/api/proxy-test');
                const proxyResult = await proxyResponse.json();
                setProxyData(proxyResult);

            } catch (error) {
                console.error('Debug test error:', error);
            } finally {
                setLoading(false);
            }
        };

        runTests();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Debug Dashboard</h1>
                <div className="text-center py-8">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">Running diagnostic tests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Debug Dashboard</h1>

            {/* Environment Variables */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Environment Variables</h2>
                    <pre className="bg-base-200 p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(envData, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Comprehensive Tests */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Comprehensive Tests</h2>
                    {testData && (
                        <div>
                            <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                                <div className="stat">
                                    <div className="stat-title">Total Tests</div>
                                    <div className="stat-value">{testData.summary?.total || 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Passed</div>
                                    <div className="stat-value text-success">{testData.summary?.passed || 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Failed</div>
                                    <div className="stat-value text-error">{testData.summary?.failed || 0}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {testData.tests?.map((test, index) => (
                                    <div key={index} className={`alert ${test.status === 'PASS' ? 'alert-success' : 'alert-error'}`}>
                                        <span className="font-medium">{test.name}</span>
                                        <span className="badge">{test.status}</span>
                                    </div>
                                ))}
                            </div>

                            <details className="collapse collapse-arrow bg-base-200 mt-4">
                                <summary className="collapse-title font-medium">Raw Test Data</summary>
                                <div className="collapse-content">
                                    <pre className="text-sm overflow-x-auto">
                                        {JSON.stringify(testData, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    )}
                </div>
            </div>

            {/* Proxy Tests */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Proxy Tests</h2>
                    {proxyData && (
                        <div>
                            <div className={`alert ${proxyData.success ? 'alert-success' : 'alert-error'} mb-4`}>
                                <span>Proxy Status: {proxyData.success ? 'Working' : 'Failed'}</span>
                            </div>

                            <details className="collapse collapse-arrow bg-base-200">
                                <summary className="collapse-title font-medium">Proxy Test Details</summary>
                                <div className="collapse-content">
                                    <pre className="text-sm overflow-x-auto">
                                        {JSON.stringify(proxyData, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Quick Actions</h2>
                    <div className="flex flex-wrap gap-2">
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Tests
                        </button>
                        <a href="/api/services" className="btn btn-secondary btn-sm" target="_blank">
                            Test /api/services
                        </a>
                        <a href="/api/debug-env" className="btn btn-accent btn-sm" target="_blank">
                            Check Environment
                        </a>
                        <a href="/services" className="btn btn-info btn-sm">
                            Go to Services Page
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}