import { getAccessToken, getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session to access ID token (standard JWT)
    let token;
    
    try {
      const session = await getSession(req, res);
      if (session?.idToken && typeof session.idToken === 'string') {
        token = session.idToken;
        console.log('Got ID token from session (standard JWT)');
      }
    } catch (error) {
      console.log('No session or ID token available');
    }
    
    // Fallback to access token if no ID token
    if (!token) {
      try {
        const { accessToken } = await getAccessToken(req, res);
        if (accessToken && typeof accessToken === 'string') {
          token = accessToken;
          console.log('Got access token (may be encrypted)');
        }
      } catch (error) {
        console.log('No access token available');
      }
    }
    
    if (!token) {
      return res.status(401).json({ error: 'No token available' });
    }

    // Validate that it looks like a JWT (3 parts separated by dots for standard JWT)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3 && tokenParts.length !== 5) {
      console.error('Invalid token format - not a JWT');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    return res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error('Error getting token:', error);
    return res.status(500).json({ error: 'Failed to get token' });
  }
} 