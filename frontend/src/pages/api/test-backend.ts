import { NextApiRequest, NextApiResponse } from 'next';

export default async function testBackend(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    // Test backend health
    const healthResponse = await fetch(`${apiUrl}/user/health`);
    const healthData = await healthResponse.json();
    
    // Test Auth0 config endpoint
    const configResponse = await fetch(`${apiUrl}/auth/config`);
    const configData = await configResponse.json();
    
    res.json({
      backend: {
        url: apiUrl,
        health: {
          status: healthResponse.status,
          data: healthData,
        },
        config: {
          status: configResponse.status,
          data: configData,
        },
      },
      frontend: {
        hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      },
    });
  } catch (error) {
    console.error('Backend test error:', error);
    res.status(500).json({ 
      error: 'Backend test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 