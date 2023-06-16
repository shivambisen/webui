/*
 * Copyright contributors to the Galasa project
 */
import dayjs from 'dayjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { Issuer, generators } from 'openid-client';

// Checks if a cookie containing a JWT exists, redirecting users to authenticate
// if a JWT does not exit or if the existing token has expired.
export const verifyAuthenticated = () => {
  const idToken = cookies().get('id_token');
  if (idToken) {
    if (isTokenExpired(idToken.value)) {
      return redirect('/auth');
    }
  } else {
    return redirect('/auth');
  }
};

// Checks whether a given JWT is expired, returning true if so, and false otherwise.
const isTokenExpired = (jwt: string) => {
  const decodedJwt = jwtDecode<JwtPayload>(jwt);
  const jwtExpiry = decodedJwt.exp;

  let isExpired = true;
  if (jwtExpiry) {
    // A JWT's expiry time is a Unix timestamp (number of seconds since the Unix Epoch),
    // so the format of the current time must match to calculate the correct difference.
    const currentTimeInEpochSeconds = dayjs().unix();
    isExpired = dayjs(jwtExpiry).diff(currentTimeInEpochSeconds) <= 0;
  }
  return isExpired;
};

// Set up the OpenID client for the WebUI as registered with Dex
const dexIssuer = await Issuer.discover(process.env.DEX_ISSUER ?? 'http://127.0.0.1:5556/dex');
export const openIdClient = new dexIssuer.Client({
  client_id: 'galasa-webui',
  client_secret: 'example-webui-client-secret',
  redirect_uris: ['http://localhost:3000/callback'],
  response_types: ['code'],
});

// Generate an authorization URL that will be used to redirect users to Dex
export const codeVerifier = generators.codeVerifier();
const codeChallenge = generators.codeChallenge(codeVerifier);
export const authUrl = openIdClient.authorizationUrl({
  scope: 'openid email profile offline_access',
  codeChallenge,
});

// GET request handler for requests to /auth
export async function GET(request: Request) {
  return NextResponse.redirect(authUrl);
}
