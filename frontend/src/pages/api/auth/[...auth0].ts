import { handleAuth } from '@auth0/nextjs-auth0';
import { auth0Config } from '../../../lib/auth0-config';

export default handleAuth(auth0Config); 