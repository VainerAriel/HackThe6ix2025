import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    // For server-side requests, we'll get the token from the session
    // For client-side requests, we'll need to get it from the Auth0 SDK
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  nickname?: string;
  picture?: string;
  email_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingData {
  boss_type: string;
  role?: string;
  confidence?: number;
  goals?: string[];
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export class ApiService {
  // Get user profile and create/update in database
  static async getUserProfile(token: string): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error in getUserProfile:', error.response?.data || error.message);
      throw error;
    }
  }

  // Sync user data with database
  static async syncUser(token: string): Promise<UserProfile> {
    try {
      const response = await apiClient.post('/auth/sync', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error in syncUser:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get user status in database
  static async getUserStatus(token: string): Promise<any> {
    const response = await apiClient.get('/auth/status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Get Auth0 configuration
  static async getAuth0Config(): Promise<any> {
    const response = await apiClient.get('/auth/config');
    return response.data;
  }

  // Get user conversations
  static async getUserConversations(token: string): Promise<any> {
    const response = await apiClient.get('/chat/conversations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Send message in conversation
  static async sendMessage(token: string, conversationId: string, message: string): Promise<any> {
    const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
      message,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Create new conversation
  static async createConversation(token: string, title: string = 'New Conversation'): Promise<any> {
    const response = await apiClient.post('/chat/conversations', {
      title,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  // Health check
  static async healthCheck(): Promise<any> {
    const response = await apiClient.get('/user/health');
    return response.data;
  }

  // Update user onboarding data
  static async updateOnboardingData(token: string, onboardingData: OnboardingData): Promise<any> {
    try {
      const response = await apiClient.post('/user/onboarding', onboardingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error in updateOnboardingData:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get user onboarding data
  static async getOnboardingData(token: string): Promise<any> {
    try {
      const response = await apiClient.get('/user/onboarding', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error in getOnboardingData:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default ApiService; 