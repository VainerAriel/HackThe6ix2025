import { AuthOptions } from '@auth0/nextjs-auth0';

export const auth0Config: AuthOptions = {
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
  session: {
    absoluteDuration: 24 * 60 * 60, // 24 hours
  },
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
  },
  // Add this to ensure we get access tokens for the API
  getAccessToken: {
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email',
    },
  },
}; 