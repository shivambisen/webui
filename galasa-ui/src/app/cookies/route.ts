/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies function from next/headers
import AuthCookies from '@/utils/authCookies';

export async function GET() {
  // Get the cookies from the request
  const clientId = cookies().get(AuthCookies.CLIENT_ID)?.value ?? '';
  const refreshToken = cookies().get(AuthCookies.REFRESH_TOKEN)?.value ?? '';

  // Return the values in the response
  return new NextResponse(
    JSON.stringify({clientId: clientId, refreshToken: refreshToken}),
    {status: 200, headers: { 'content-type': 'application/json' }}
  );
}

export async function DELETE() {

  // Access the cookies and delete the specific ones
  cookies().delete(AuthCookies.CLIENT_ID);
  cookies().delete(AuthCookies.REFRESH_TOKEN);

  // Return a response indicating success
  return new NextResponse(null, { status: 200 });
}
