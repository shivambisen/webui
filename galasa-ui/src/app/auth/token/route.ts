/*
 * Copyright contributors to the Galasa project
 */

import { Client__Output } from '@/generated/grpc/api/Client';
import { CreateClientReq } from '@/generated/grpc/api/CreateClientReq';
import { getAuthorizationUrl, getOpenIdClient } from '@/utils/auth';
import { client } from '@/utils/grpc/client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Stop this route from being pre-rendered
export const dynamic = 'force-dynamic';

// POST request handler for requests to /auth/token
export async function POST(request: Request) {
  const body = await request.json();
  const callbackUrl = `${process.env.WEBUI_HOST_URL}/auth/token/callback`
  const dexClient = await createDexClient(body.name, Buffer.from(body.secret, 'base64').toString(), callbackUrl);

  let responseJson = { url: '/' };

  if (dexClient?.id && dexClient?.secret) {
    const openIdClient = await getOpenIdClient(dexClient.id, dexClient.secret, callbackUrl);
    const authUrl = getAuthorizationUrl(openIdClient);

    cookies().set('clientId', dexClient.id);
    cookies().set('clientSecret', body.secret);
    responseJson = { url: authUrl };
  }

  return NextResponse.json(responseJson);
}

// Creates a new Dex client using Dex's gRPC API, wrapped in a promise to allow for blocking calls.
const createDexClient = (name: string, secret: string, callbackUrl: string) => {
  const clientReq: CreateClientReq = {
    client: {
      name,
      secret,
      redirectUris: [callbackUrl],
    },
  };

  return new Promise<Client__Output | undefined>((resolve, reject) => {
    client.CreateClient(clientReq, (err, value) => {
      if (err == null) {
        resolve(value?.client);
      } else {
        reject(err);
      }
    });
  });
};
