import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom hook for API calls with authentication
export const useApi = () => {
  const { user, error, isLoading } = useUser();

  const makeAuthenticatedRequest = async (config) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // For Next.js Auth0, we need to get the access token from the session
      // This requires a server-side call or using the session API
      const response = await fetch('/api/auth/token');
      const { accessToken } = await response.json();
      
      const authConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      return await apiClient(authConfig);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  const getPublicData = async () => {
    return await apiClient.get('/auth/public');
  };

  const getProtectedData = async () => {
    return await makeAuthenticatedRequest({
      method: 'GET',
      url: '/auth/protected',
    });
  };

  const getUserProfile = async () => {
    return await makeAuthenticatedRequest({
      method: 'GET',
      url: '/auth/profile',
    });
  };

  const postData = async (data) => {
    return await makeAuthenticatedRequest({
      method: 'POST',
      url: '/user/data',
      data,
    });
  };

  const getHealth = async () => {
    return await apiClient.get('/user/health');
  };

  return {
    getPublicData,
    getProtectedData,
    getUserProfile,
    postData,
    getHealth,
    isAuthenticated: !!user,
  };
}; 