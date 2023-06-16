/*
 * Copyright contributors to the Galasa project
 */
import { NextResponse } from 'next/server';
import { openIdClient } from '../auth/route';
import { cookies } from 'next/headers';

// GET request handler for requests to /callback
export async function GET(request: Request) {
  const callbackParams = openIdClient.callbackParams(request.url);
  callbackParams.state = undefined;

  const authToken = await openIdClient.callback('http://localhost:3000/callback', callbackParams);

  // Set the ID token cookie
  if (authToken.id_token) {
    cookies().set('id_token', authToken.id_token, { secure: true });
  }

  return NextResponse.redirect(new URL('/', request.url));
}
