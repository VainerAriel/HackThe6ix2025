import { getSession, getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function debug(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get session info
    const session = await getSession(req, res);
    
    // Try to get access token
    let accessToken = null;
    let tokenError = null;
    
    try {
      const tokenResponse = await getAccessToken(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: 'openid profile email',
        },
      });
      accessToken = tokenResponse.accessToken;
    } catch (error) {
      tokenError = error instanceof Error ? error.message : 'Unknown token error';
    }

    // Return debug information
    res.json({
      session: {
        user: session?.user ? {
          sub: session.user.sub,
          email: session.user.email,
          name: session.user.name,
        } : null,
        accessToken: accessToken ? {
          exists: true,
          length: accessToken.length,
          preview: `${accessToken.substring(0, 20)}...`,
        } : null,
        tokenError,
      },
      environment: {
        hasAudience: !!process.env.AUTH0_AUDIENCE,
        audience: process.env.AUTH0_AUDIENCE,
        hasIssuer: !!process.env.AUTH0_ISSUER_BASE_URL,
        issuer: process.env.AUTH0_ISSUER_BASE_URL,
        hasClientId: !!process.env.AUTH0_CLIENT_ID,
        clientId: process.env.AUTH0_CLIENT_ID,
      },
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ 
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 