/*
 * Copyright contributors to the Galasa project
 */
import { NextResponse } from 'next/server';
import { getOpenIdClient } from '../route';
import { cookies } from 'next/headers';

// GET request handler for requests to /callback
export async function GET(request: Request) {
  const openIdClient = await getOpenIdClient();
  const callbackParams = openIdClient.callbackParams(request.url);

  const authToken = await openIdClient.callback('http://localhost:3000/auth/callback', callbackParams, { state: callbackParams.state });

  // Set the ID token cookie
  if (authToken.id_token) {
    cookies().set('id_token', authToken.id_token, { secure: true });
  }

  return NextResponse.redirect(new URL('/', request.url));
}
