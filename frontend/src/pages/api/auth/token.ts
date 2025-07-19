import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function token(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Add a small delay to ensure session is fully established
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { accessToken } = await getAccessToken(req, res, {
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: 'openid profile email',
      },
    });
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token available' });
    }
    
    res.json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    
    // If it's a token-related error, return 401 instead of 500
    if (error instanceof Error && error.message.includes('token')) {
      return res.status(401).json({ error: 'Token not ready yet' });
    }
    
    res.status(500).json({ error: 'Failed to get access token' });
  }
}); 