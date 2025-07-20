import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = await getAccessToken(req, res);
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token available' });
    }

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    return res.status(500).json({ error: 'Failed to get access token' });
  }
} 