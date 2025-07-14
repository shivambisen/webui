/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import pako from 'pako';
import { Base64 } from 'js-base64';


/**
 * Compresses a query string and encodes it into a URL-safe Base64 string.
 */
export function encodeStateToUrlParam(queryString: string) : string {
  let encodedQuery = '';
  if (queryString !== null && queryString !== '') {
    const compressed = pako.deflate(queryString);
    queryString = Base64.fromUint8Array(compressed, true);
  }
  return encodedQuery;
}

/**
 * Decodes a URL-safe Base64 string and decompresses it back to the original query string.
 */
export function decodeStateFromUrlParam(encodedParam: string): string | null {
  if (!encodedParam) return null;
  try {
    const compressed = Base64.toUint8Array(encodedParam);
    return pako.inflate(compressed, { to: 'string' });
  } catch (error) {
    console.error("Failed to decode URL state:", error);
    return null;
  }
}