/*
 * Copyright contributors to the Galasa project
 */
// Stop this route from being pre-rendered
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getOpenIdClient } from '../route';
import { cookies } from 'next/headers';

// GET request handler for requests to /callback
export async function GET(request: Request) {
  const openIdClient = await getOpenIdClient();
  const state = cookies().get('state')?.value;

  // Get the returned token set (which includes a JWT) from Dex
  const callbackParams = openIdClient.callbackParams(request.url);
  const tokenSet = await openIdClient.callback(process.env.DEX_CLIENT_CALLBACK, callbackParams, { state });

  // The state cookie is no longer needed, so we can delete it.
  if (state) {
    cookies().delete('state');
  }

  // Set the ID token cookie
  if (tokenSet.id_token) {
    cookies().set('id_token', tokenSet.id_token, { secure: true });
  }

  return NextResponse.redirect(new URL('/', request.url));
}
