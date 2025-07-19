import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

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
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const makeAuthenticatedRequest = async (config) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const token = await getAccessTokenSilently();
      const authConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
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
    isAuthenticated,
  };
}; 