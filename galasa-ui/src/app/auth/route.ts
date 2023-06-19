/*
 * Copyright contributors to the Galasa project
 */
import { NextResponse } from 'next/server';
import { Issuer, generators } from 'openid-client';

// Set up the OpenID client for the WebUI as registered with Dex
export const getOpenIdClient = async () => {
  return Issuer.discover(process.env.DEX_ISSUER ?? 'http://127.0.0.1:5556/dex').then(
    (dexIssuer) =>
      new dexIssuer.Client({
        client_id: 'galasa-webui',
        client_secret: 'example-webui-client-secret',
        redirect_uris: ['http://localhost:3000/auth/callback'],
        response_types: ['code'],
      })
  );
};

// GET request handler for requests to /auth
export async function GET(request: Request) {
  const state = generators.state();
  const authUrl = (await getOpenIdClient()).authorizationUrl({
    scope: 'openid email profile offline_access',
    state,
  });

  return NextResponse.redirect(authUrl);
}
