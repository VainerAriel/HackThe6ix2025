import { useState, useEffect, useCallback } from 'react';
import { useUser as useAuth0User } from '@auth0/nextjs-auth0/client';
import ApiService, { UserProfile } from '../lib/api';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSynced: boolean;
  lastSyncAttempt: number | null;
}

export const useUser = () => {
  const { user: auth0User, isLoading: auth0Loading, error: auth0Error } = useAuth0User();
  const [userState, setUserState] = useState<UserState>({
    profile: null,
    isLoading: false,
    error: null,
    isSynced: false,
    lastSyncAttempt: null,
  });

  // Function to sync user with database
  const syncUserWithDatabase = useCallback(async () => {
    if (!auth0User) return;

    console.log('syncUserWithDatabase: Starting sync for user', auth0User.sub);
    setUserState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get the access token from Auth0 with retry logic
      let token = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (!token && retries < maxRetries) {
        try {
          console.log(`syncUserWithDatabase: Attempting to get token (attempt ${retries + 1}/${maxRetries})`);
          const tokenResponse = await fetch('/api/auth/token');
          
          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.log('syncUserWithDatabase: Token request failed', {
              status: tokenResponse.status,
              error: errorData.error
            });
            // If token is not ready, don't retry - this is expected during initial load
            if (tokenResponse.status === 401 && errorData.error?.includes('not ready')) {
              throw new Error('Token not ready yet');
            }
            throw new Error(`Token request failed: ${errorData.error || tokenResponse.statusText}`);
          }
          
          const tokenData = await tokenResponse.json();
          token = tokenData.accessToken;
          
          if (!token) {
            throw new Error('No access token available');
          }
          
          console.log('syncUserWithDatabase: Successfully got token');
        } catch (error) {
          retries++;
          console.log(`syncUserWithDatabase: Token attempt ${retries} failed:`, error);
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
      
      console.log('syncUserWithDatabase: Successfully synced user profile');
      
      setUserState({
        profile,
        isLoading: false,
        error: null,
        isSynced: true,
        lastSyncAttempt: Date.now(),
      });

      return profile;
    } catch (error) {
      console.error('Error syncing user with database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync user';
      
      setUserState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        lastSyncAttempt: Date.now(),
      }));
      
      // Don't throw error for token not ready - this is expected
      if (errorMessage.includes('Token not ready yet')) {
        console.log('syncUserWithDatabase: Token not ready - this is expected, not retrying');
        return null;
      }
      
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
        lastSyncAttempt: Date.now(),
      });

      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      setUserState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get user profile',
        lastSyncAttempt: Date.now(),
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

  // Auto-sync user when Auth0 user changes, but with better error handling
  useEffect(() => {
    if (auth0User && !userState.isSynced && !userState.isLoading) {
      // Check if we've tried recently (within last 30 seconds)
      const now = Date.now();
      const lastAttempt = userState.lastSyncAttempt || 0;
      const timeSinceLastAttempt = now - lastAttempt;
      
      console.log('useUser: Checking sync conditions', {
        hasAuth0User: !!auth0User,
        isSynced: userState.isSynced,
        isLoading: userState.isLoading,
        timeSinceLastAttempt,
        shouldRetry: timeSinceLastAttempt > 30000
      });
      
      // Only retry if it's been more than 30 seconds since last attempt
      if (timeSinceLastAttempt > 30000) {
        console.log('useUser: Starting sync attempt');
        // Add a small delay to ensure Auth0 session is fully established
        const timer = setTimeout(() => {
          syncUserWithDatabase();
        }, 1000);
        
        return () => clearTimeout(timer);
      } else {
        console.log('useUser: Skipping sync - too recent');
      }
    }
  }, [auth0User, userState.isSynced, userState.isLoading, userState.lastSyncAttempt, syncUserWithDatabase]);

  // Reset state when user logs out
  useEffect(() => {
    if (!auth0User) {
      setUserState({
        profile: null,
        isLoading: false,
        error: null,
        isSynced: false,
        lastSyncAttempt: null,
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