import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function token(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('token endpoint: Starting token request');
    
    // Add a small delay to ensure session is fully established
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('token endpoint: Getting session from Auth0');
    const session = await getSession(req, res);
    
    if (!session) {
      console.log('token endpoint: No session available');
      return res.status(401).json({ error: 'No session available' });
    }
    
    // Use the ID token instead of access token
    const idToken = session.idToken;
    
    if (!idToken) {
      console.log('token endpoint: No ID token available');
      return res.status(401).json({ error: 'No ID token available' });
    }
    
    console.log('token endpoint: Successfully got ID token');
    res.json({ accessToken: idToken });
  } catch (error) {
    console.error('token endpoint: Error getting token:', error);
    
    // Handle specific Auth0 errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Token-related errors that indicate the token isn't ready yet
      if (errorMessage.includes('token') || 
          errorMessage.includes('session') || 
          errorMessage.includes('not ready') ||
          errorMessage.includes('expired')) {
        console.log('token endpoint: Token not ready - returning 401');
        return res.status(401).json({ error: 'Token not ready yet' });
      }
      
      // Authentication errors
      if (errorMessage.includes('unauthorized') || 
          errorMessage.includes('forbidden') ||
          errorMessage.includes('invalid')) {
        console.log('token endpoint: Authentication failed - returning 401');
        return res.status(401).json({ error: 'Authentication failed' });
      }
    }
    
    console.log('token endpoint: Unknown error - returning 500');
    res.status(500).json({ error: 'Failed to get token' });
  }
}); 