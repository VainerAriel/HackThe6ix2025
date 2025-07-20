import { getSession, getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function testToken(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get session info
    const session = await getSession(req, res);
    
    // Try to get access token
    let accessToken = null;
    let tokenError = null;
    let tokenDetails = null;
    
    try {
      const tokenResponse = await getAccessToken(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: 'openid profile email',
        },
      });
      accessToken = tokenResponse.accessToken;
      tokenDetails = {
        hasToken: true,
        length: accessToken?.length || 0,
        preview: accessToken ? `${accessToken.substring(0, 20)}...` : 'No token',
      };
    } catch (error) {
      tokenError = error instanceof Error ? error.message : 'Unknown token error';
      tokenDetails = {
        hasToken: false,
        error: tokenError,
      };
    }

    // Test the token with backend
    let backendTest = null;
    if (accessToken) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        backendTest = {
          status: response.status,
          ok: response.ok,
          data: response.ok ? await response.json() : await response.text(),
        };
      } catch (error) {
        backendTest = {
          error: error instanceof Error ? error.message : 'Backend test failed',
        };
      }
    }

    // Return comprehensive debug information
    res.json({
      session: {
        user: session?.user ? {
          sub: session.user.sub,
          email: session.user.email,
          name: session.user.name,
        } : null,
        hasSession: !!session,
      },
      token: tokenDetails,
      backend: backendTest,
      environment: {
        hasAudience: !!process.env.AUTH0_AUDIENCE,
        audience: process.env.AUTH0_AUDIENCE,
        hasIssuer: !!process.env.AUTH0_ISSUER_BASE_URL,
        issuer: process.env.AUTH0_ISSUER_BASE_URL,
        hasClientId: !!process.env.AUTH0_CLIENT_ID,
        clientId: process.env.AUTH0_CLIENT_ID,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
      },
    });
  } catch (error) {
    console.error('Token test error:', error);
    res.status(500).json({ 
      error: 'Token test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 