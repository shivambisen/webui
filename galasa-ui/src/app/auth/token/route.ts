/*
 * Copyright contributors to the Galasa project
 */

import { CreateClientReq } from '@/grpc/api/CreateClientReq';
import { CreateClientResp__Output } from '@/grpc/api/CreateClientResp';
import { client } from '@/grpc/client';
import { UnaryCallback } from '@grpc/grpc-js/build/src/client';
import { NextResponse } from 'next/server';

let returnvalue: string | undefined;
// Stop this route from being pre-rendered
export const dynamic = 'force-dynamic';

// POST request handler for requests to /auth/token
export async function POST(request: Request) {
  const body = await request.json();
  const clientReq: CreateClientReq = {
    client: {
      name: body.name,
      secret: Buffer.from(body.secret, 'base64').toString(),

    },
  };

  const callback: UnaryCallback<CreateClientResp__Output> = (err, value) => {
    if (err == null) {
      returnvalue = value?.client?.secret;
      console.log(returnvalue);
    } else {
      console.log(err);
    }
  };
  client.CreateClient(clientReq, callback);

  return NextResponse.json({ secret: returnvalue});
}
