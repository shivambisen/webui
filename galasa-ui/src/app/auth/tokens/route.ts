/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { sendAuthRequest } from '@/utils/auth';
import { createAuthenticatedApiConfiguration, getApiClientWithAuthHeader } from '@/utils/api';
import AuthCookies from '@/utils/authCookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AuthenticationAPIApi } from '@/generated/galasaapi';

// Stop this route from being pre-rendered
export const dynamic = 'force-dynamic';
const GALASA_API_SERVER_URL = process.env.GALASA_API_SERVER_URL ?? '';

interface TokenDetails {
  tokenDescription: string,
}


// POST request handler for requests to /auth/tokens
export async function POST(request: NextRequest) {
  // Call out to the API server's /auth/clients endpoint to create a new Dex client

  const bearerTokenCookie = getApiClientWithAuthHeader()
  const authApiClientWithAuthHeader = new AuthenticationAPIApi(createAuthenticatedApiConfiguration(GALASA_API_SERVER_URL, bearerTokenCookie))
  const dexClient = await authApiClientWithAuthHeader.postClients();

  const clientId = dexClient.clientId;
  if (clientId) {
    // Store the client ID to be displayed to the user later
    cookies().set(AuthCookies.CLIENT_ID, clientId, { httpOnly: true });

    // Store the token description to be passed to the API server on the callback
    const requestBody: TokenDetails = await request.json();
    cookies().set(AuthCookies.TOKEN_DESCRIPTION, requestBody.tokenDescription, { httpOnly: true });

    // Authenticate with the created client to get a new refresh token for this client
    const authResponse = await sendAuthRequest(clientId);

    const response = NextResponse.json({ url: authResponse.headers.get('Location') ?? authResponse.url });
    response.headers.set('Set-Cookie', authResponse.headers.get('Set-Cookie') ?? '');

    return response;
  } else {
    throw new Error('Failed to create personal access token.');
  }
}


export async function DELETE() {

  // an api route is made because, cookies are server side props and cannot be access directly on components
  // that use 'use client' keyword.

  cookies().delete(AuthCookies.ID_TOKEN);

  return (new NextResponse(null, { status: 204 }))

}