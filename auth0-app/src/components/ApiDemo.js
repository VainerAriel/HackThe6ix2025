import React, { useState } from 'react';
import { useApi } from './ApiService';

const ApiDemo = () => {
  const {
    getPublicData,
    getProtectedData,
    getUserProfile,
    postData,
    getHealth,
    isAuthenticated,
  } = useApi();

  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [postDataInput, setPostDataInput] = useState('');

  const handleApiCall = async (apiFunction, key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));
    
    try {
      const response = await apiFunction();
      setResults(prev => ({ ...prev, [key]: response.data }));
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        [key]: err.response?.data?.error || err.message 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handlePostData = async () => {
    if (!postDataInput.trim()) return;
    
    setLoading(prev => ({ ...prev, postData: true }));
    setError(prev => ({ ...prev, postData: null }));
    
    try {
      const response = await postData({ message: postDataInput });
      setResults(prev => ({ ...prev, postData: response.data }));
      setPostDataInput('');
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        postData: err.response?.data?.error || err.message 
      }));
    } finally {
      setLoading(prev => ({ ...prev, postData: false }));
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>API Integration Demo</h2>
      
      {/* Health Check */}
      <div style={{ marginBottom: 20 }}>
        <h3>Health Check (Public)</h3>
        <button 
          onClick={() => handleApiCall(getHealth, 'health')}
          disabled={loading.health}
        >
          {loading.health ? 'Loading...' : 'Check Health'}
        </button>
        {results.health && (
          <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
            {JSON.stringify(results.health, null, 2)}
          </pre>
        )}
        {error.health && (
          <div style={{ color: 'red' }}>Error: {error.health}</div>
        )}
      </div>

      {/* Public Data */}
      <div style={{ marginBottom: 20 }}>
        <h3>Public Data</h3>
        <button 
          onClick={() => handleApiCall(getPublicData, 'public')}
          disabled={loading.public}
        >
          {loading.public ? 'Loading...' : 'Get Public Data'}
        </button>
        {results.public && (
          <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
            {JSON.stringify(results.public, null, 2)}
          </pre>
        )}
        {error.public && (
          <div style={{ color: 'red' }}>Error: {error.public}</div>
        )}
      </div>

      {/* Protected Data */}
      <div style={{ marginBottom: 20 }}>
        <h3>Protected Data</h3>
        {!isAuthenticated ? (
          <div style={{ color: 'orange' }}>Please log in to access protected data</div>
        ) : (
          <>
            <button 
              onClick={() => handleApiCall(getProtectedData, 'protected')}
              disabled={loading.protected}
            >
              {loading.protected ? 'Loading...' : 'Get Protected Data'}
            </button>
            {results.protected && (
              <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                {JSON.stringify(results.protected, null, 2)}
              </pre>
            )}
            {error.protected && (
              <div style={{ color: 'red' }}>Error: {error.protected}</div>
            )}
          </>
        )}
      </div>

      {/* User Profile */}
      <div style={{ marginBottom: 20 }}>
        <h3>User Profile</h3>
        {!isAuthenticated ? (
          <div style={{ color: 'orange' }}>Please log in to access user profile</div>
        ) : (
          <>
            <button 
              onClick={() => handleApiCall(getUserProfile, 'profile')}
              disabled={loading.profile}
            >
              {loading.profile ? 'Loading...' : 'Get User Profile'}
            </button>
            {results.profile && (
              <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                {JSON.stringify(results.profile, null, 2)}
              </pre>
            )}
            {error.profile && (
              <div style={{ color: 'red' }}>Error: {error.profile}</div>
            )}
          </>
        )}
      </div>

      {/* Post Data */}
      <div style={{ marginBottom: 20 }}>
        <h3>Post Data</h3>
        {!isAuthenticated ? (
          <div style={{ color: 'orange' }}>Please log in to post data</div>
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                value={postDataInput}
                onChange={(e) => setPostDataInput(e.target.value)}
                placeholder="Enter message to post"
                style={{ 
                  padding: 8, 
                  marginRight: 10, 
                  borderRadius: 4, 
                  border: '1px solid #ccc',
                  width: 250
                }}
              />
              <button 
                onClick={handlePostData}
                disabled={loading.postData || !postDataInput.trim()}
              >
                {loading.postData ? 'Posting...' : 'Post Data'}
              </button>
            </div>
            {results.postData && (
              <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4 }}>
                {JSON.stringify(results.postData, null, 2)}
              </pre>
            )}
            {error.postData && (
              <div style={{ color: 'red' }}>Error: {error.postData}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ApiDemo; 