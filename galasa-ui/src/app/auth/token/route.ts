/*
 * Copyright contributors to the Galasa project
 */

import { CreateClientReq } from '@/grpc/api/CreateClientReq';
import { CreateClientResp__Output } from '@/grpc/api/CreateClientResp';
import { client } from '@/grpc/client';
import { UnaryCallback } from '@grpc/grpc-js/build/src/client';
import { NextResponse } from 'next/server';

// Stop this route from being pre-rendered
export const dynamic = 'force-dynamic';

// POST request handler for requests to /auth/token
export async function POST(request: Request) {
  const clientReq: CreateClientReq = {
    client: {
      secret: 'secretC',
      name: 'Test Deez',
    },
  };

  const callback: UnaryCallback<CreateClientResp__Output> = (err, value) => {
    if (err == null) {
      console.log(value);
    } else {
      console.log(err);
    }
  };
  client.CreateClient(clientReq, callback);

  return NextResponse.json({});
}
