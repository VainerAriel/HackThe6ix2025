import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthDebug() {
  const { user, isLoading } = useUser();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [backendInfo, setBackendInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testToken = async () => {
    try {
      setError(null);
      const response = await fetch('/api/auth/test-token');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get debug info');
      }
      
      setTokenInfo({
        hasToken: data.token?.hasToken || false,
        tokenLength: data.token?.length || 0,
        tokenPreview: data.token?.preview || 'No token',
        tokenError: data.token?.error,
        environment: data.environment,
        user: data.session?.user,
        backendTest: data.backend,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testBackend = async () => {
    try {
      setError(null);
      const response = await fetch('/api/test-backend');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to test backend');
      }
      
      setBackendInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white">Auth Debug Info</h3>
      
      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-gray-400">Authenticated:</span>
          <span className={`ml-2 ${user ? 'text-green-400' : 'text-red-400'}`}>
            {user ? 'Yes' : 'No'}
          </span>
        </div>
        
        {user && (
          <div className="text-sm">
            <span className="text-gray-400">User ID:</span>
            <span className="ml-2 text-white">{user.sub}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={testToken}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Debug Auth
        </button>
        <button
          onClick={testBackend}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Backend
        </button>
      </div>

      {tokenInfo && (
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-400">Has Token:</span>
            <span className={`ml-2 ${tokenInfo.hasToken ? 'text-green-400' : 'text-red-400'}`}>
              {tokenInfo.hasToken ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Token Length:</span>
            <span className="ml-2 text-white">{tokenInfo.tokenLength}</span>
          </div>
          <div>
            <span className="text-gray-400">Token Preview:</span>
            <span className="ml-2 text-white font-mono">{tokenInfo.tokenPreview}</span>
          </div>
          
          {tokenInfo.tokenError && (
            <div className="bg-red-900 p-2 rounded">
              <span className="text-red-400">Token Error:</span>
              <div className="text-red-300 text-xs mt-1">{tokenInfo.tokenError}</div>
            </div>
          )}
          
          {tokenInfo.user && (
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-gray-400">User Info:</span>
              <div className="text-white text-xs mt-1">
                <div>ID: {tokenInfo.user.sub}</div>
                <div>Email: {tokenInfo.user.email}</div>
                <div>Name: {tokenInfo.user.name}</div>
              </div>
            </div>
          )}
          
          {tokenInfo.environment && (
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-gray-400">Environment:</span>
              <div className="text-white text-xs mt-1">
                <div>Audience: {tokenInfo.environment.audience || 'Not set'}</div>
                <div>Issuer: {tokenInfo.environment.issuer || 'Not set'}</div>
                <div>Client ID: {tokenInfo.environment.clientId || 'Not set'}</div>
              </div>
            </div>
          )}
          
          {tokenInfo.backendTest && (
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-gray-400">Backend Token Test:</span>
              <div className="text-white text-xs mt-1">
                <div>Status: <span className={tokenInfo.backendTest.ok ? 'text-green-400' : 'text-red-400'}>{tokenInfo.backendTest.status}</span></div>
                {tokenInfo.backendTest.error && (
                  <div className="text-red-400">Error: {tokenInfo.backendTest.error}</div>
                )}
                {tokenInfo.backendTest.data && (
                  <div className="mt-1">
                    <span className="text-gray-400">Response:</span>
                    <pre className="text-white text-xs mt-1 overflow-auto">
                      {JSON.stringify(tokenInfo.backendTest.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {backendInfo && (
        <div className="space-y-3 text-sm">
          <div className="bg-gray-700 p-2 rounded">
            <span className="text-gray-400">Backend Test Results:</span>
            <div className="text-white text-xs mt-1">
              <div>API URL: {backendInfo.backend?.url}</div>
              <div>Health Status: {backendInfo.backend?.health?.status}</div>
              <div>Config Status: {backendInfo.backend?.config?.status}</div>
            </div>
          </div>
          
          {backendInfo.backend?.health?.data && (
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-gray-400">Health Response:</span>
              <pre className="text-white text-xs mt-1 overflow-auto">
                {JSON.stringify(backendInfo.backend.health.data, null, 2)}
              </pre>
            </div>
          )}
          
          {backendInfo.backend?.config?.data && (
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-gray-400">Config Response:</span>
              <pre className="text-white text-xs mt-1 overflow-auto">
                {JSON.stringify(backendInfo.backend.config.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
} 