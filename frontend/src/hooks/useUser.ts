import { useState, useEffect, useCallback } from 'react';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client';
import ApiService, { UserProfile } from '../lib/api';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSynced: boolean;
}

export const useUser = () => {
  const { user: auth0User, isLoading: auth0Loading, error: auth0Error } = useAuth0User();
  const [userState, setUserState] = useState<UserState>({
    profile: null,
    isLoading: false,
    error: null,
    isSynced: false,
  });

  // Function to sync user with database
  const syncUserWithDatabase = useCallback(async () => {
    if (!auth0User) return;

    setUserState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get the access token from Auth0 with retry logic
      let token = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (!token && retries < maxRetries) {
        try {
          const tokenResponse = await fetch('/api/auth/token');
          
          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(`Token request failed: ${errorData.error || tokenResponse.statusText}`);
          }
          
          const tokenData = await tokenResponse.json();
          token = tokenData.accessToken;
          
          if (!token) {
            throw new Error('No access token available');
          }
        } catch (error) {
          retries++;
          if (retries >= maxRetries) {
            throw error;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }

      console.log('Got access token, syncing with database...');

      // Sync user with database
      const profile = await ApiService.syncUser(token);
      
      setUserState({
        profile,
        isLoading: false,
        error: null,
        isSynced: true,
      });

      return profile;
    } catch (error) {
      console.error('Error syncing user with database:', error);
      setUserState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sync user',
      }));
      throw error;
    }
  }, [auth0User]);

  // Function to get user profile
  const getUserProfile = useCallback(async () => {
    if (!auth0User) return;

    setUserState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get the access token from Auth0
      const token = await fetch('/api/auth/token').then(res => res.json()).then(data => data.accessToken);
      
      if (!token) {
        throw new Error('No access token available');
      }

      // Get user profile (this will also sync with database)
      const profile = await ApiService.getUserProfile(token);
      
      setUserState({
        profile,
        isLoading: false,
        error: null,
        isSynced: true,
      });

      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      setUserState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile',
      }));
      throw error;
    }
  }, [auth0User]);

  // Function to check user status
  const checkUserStatus = useCallback(async () => {
    if (!auth0User) return;

    try {
      // Get the access token from Auth0
      const token = await fetch('/api/auth/token').then(res => res.json()).then(data => data.accessToken);
      
      if (!token) {
        throw new Error('No access token available');
      }

      const status = await ApiService.getUserStatus(token);
      return status;
    } catch (error) {
      console.error('Error checking user status:', error);
      throw error;
    }
  }, [auth0User]);

  // Auto-sync user when Auth0 user changes
  useEffect(() => {
    if (auth0User && !userState.isSynced && !userState.isLoading) {
      // Add a small delay to ensure Auth0 session is fully established
      const timer = setTimeout(() => {
        syncUserWithDatabase();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [auth0User, userState.isSynced, userState.isLoading, syncUserWithDatabase]);

  // Reset state when user logs out
  useEffect(() => {
    if (!auth0User) {
      setUserState({
        profile: null,
        isLoading: false,
        error: null,
        isSynced: false,
      });
    }
  }, [auth0User]);

  return {
    // Auth0 user data
    auth0User,
    auth0Loading,
    auth0Error,
    
    // Database user data
    profile: userState.profile,
    isLoading: userState.isLoading || auth0Loading,
    error: userState.error || auth0Error?.message,
    isSynced: userState.isSynced,
    
    // Functions
    syncUserWithDatabase,
    getUserProfile,
    checkUserStatus,
  };
}; 