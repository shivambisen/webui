/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

export const handleDeleteCookieApiOperation = async (router: any) => {

  const response = await fetch('/logout', { method: 'DELETE' });

  if (response.status === 204) {

    //auto redirect to render dex login page
    router.refresh();

  }
};

export function parseIsoDateTime(isoString: string) {
  // Construct a Date object
  const dt = new Date(isoString);

  // Pad helper
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Extract components
  const year  = dt.getUTCFullYear();
  const month = pad(dt.getUTCMonth() + 1);
  const day   = pad(dt.getUTCDate());
  const hours = pad(dt.getUTCHours());
  const mins  = pad(dt.getUTCMinutes());
  const secs  = pad(dt.getUTCSeconds());

  const date = `${day}/${month}/${year}`;
  const time = `${hours}:${mins}:${secs}`;

  return `${date} ${time}`;
}


/**
 * Calculates the absolute time difference between two ISO timestamps
 * and formats it as a human-readable string.
 *
 * Examples:
 *   getIsoTimeDifference("2025-05-28T09:07:19Z", "2025-05-28T09:09:43Z")
 *     → "2 mins 24 secs"
 *   getIsoTimeDifference("2025-05-28T06:00:00Z", "2025-05-28T09:52:02Z")
 *     → "3 hrs 52 mins 2 secs"
 *
 * @param startTime - the start time
 * @param endTime - the end time
 * @returns formatted duration string
 */
export function getIsoTimeDifference(startTime: string, endTime: string): string {
  // Parse dates and get difference in seconds
  const t1 = Date.parse(startTime);
  const t2 = Date.parse(endTime);
  let delta = Math.abs(t2 - t1) / 1000;  // seconds

  // Compute components
  const hours   = Math.floor(delta / 3600);
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60);
  const seconds = Math.round((delta - minutes * 60) * 10) / 10;

  // Build parts with proper pluralization, skipping zero units
  const parts: string[] = [];
  if (hours   > 0) parts.push(`${hours} hr${hours   !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes !== 1 ? "s" : ""}`);
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} sec${seconds !== 1 ? "s" : ""}`);
  }

  return parts.join(" ");
}
