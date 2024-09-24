/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies function from next/headers
import AuthCookies from '@/utils/authCookies';

export async function GET(request: Request) {
  // Get the cookies from the request
  const clientId = cookies().get(AuthCookies.CLIENT_ID)?.value ?? '';
  const refreshToken = cookies().get(AuthCookies.REFRESH_TOKEN)?.value ?? '';

  // Return the values in the response
  return NextResponse.json({ clientId, refreshToken }, {status: 200});
}

export async function DELETE() {
    // Access the cookies and delete the specific ones
    cookies().delete(AuthCookies.CLIENT_ID);
    cookies().delete(AuthCookies.REFRESH_TOKEN);
  
    // Return a response indicating success
    return NextResponse.json({ message: 'Cookies deleted successfully' }, {status: 200});
  }
