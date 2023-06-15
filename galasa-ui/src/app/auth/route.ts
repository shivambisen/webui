/*
 * Copyright contributors to the Galasa project
 */
import { NextResponse } from "next/server";
import { Issuer, generators } from "openid-client";

// Set up the OpenID client for the WebUI as registered with Dex
const dexIssuer = await Issuer.discover(process.env.DEX_ISSUER ?? "http://127.0.0.1:5556/dex");
export const openIdClient = new dexIssuer.Client({
  client_id: 'galasa-webui',
  client_secret: 'example-secret',
  redirect_uris: ['http://localhost:3000/callback'],
  response_types: ['code'],
});

// Generate an authorization URL that will be used to redirect users to Dex
export const codeVerifier  = generators.codeVerifier();
const codeChallenge = generators.codeChallenge(codeVerifier);
export const authUrl = openIdClient.authorizationUrl({
  scope: "openid email profile offline_access",
  codeChallenge,
});

// GET request handler for requests to /auth
export async function GET(request: Request) {
  return NextResponse.redirect(authUrl);
};
