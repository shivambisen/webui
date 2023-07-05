/*
 * Copyright contributors to the Galasa project
 */
// Stop this route from being pre-rendered
export const dynamic = 'force-dynamic';

import { getOpenIdClient } from '../route';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// GET request handler for requests to /auth/callback
export async function GET(request: Request) {
  const openIdClient = await getOpenIdClient();
  const state = cookies().get('state')?.value;

  // Get the returned token set (which includes a JWT) from Dex
  const callbackParams = openIdClient.callbackParams(request.url);
  const tokenSet = await openIdClient.callback(`${process.env.WEBUI_HOST_URL}/auth/callback`, callbackParams, { state });

  // The state cookie is no longer needed, so we can delete it.
  if (state) {
    cookies().delete('state');
  }

  // Set the ID token cookie
  if (tokenSet.id_token) {
    cookies().set('id_token', tokenSet.id_token);
  }
  redirect('/');
}
