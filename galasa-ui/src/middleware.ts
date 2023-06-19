import dayjs from 'dayjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { NextResponse, NextRequest } from 'next/server';

// Checks if a cookie containing a JWT exists, redirecting users to authenticate
// if a JWT does not exit or if the existing token has expired.
const isAuthenticated = (request: NextRequest) => {
  const idToken = request.cookies.get('id_token');
  let isAuthenticated = false;
  if (idToken) {
    if (!isTokenExpired(idToken.value)) {
      isAuthenticated = true;
    }
  }
  return isAuthenticated;
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

// Runs before any request is completed
export function middleware(request: NextRequest) {
  let response = NextResponse.next();
  if (!isAuthenticated(request)) {
    response = NextResponse.redirect(new URL('/auth', request.url));
  }
  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with /auth
    '/((?!auth).*)',
  ],
};
