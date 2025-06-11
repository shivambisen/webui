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
  let formattedDateTime = "";

  if (isNaN(dt.getTime())) {
    formattedDateTime = "Invalid date";
  } else {

    // Pad helper
    const pad = (n: number) => n.toString().padStart(2, '0');

    // Extract components
    const year = dt.getUTCFullYear();
    const month = pad(dt.getUTCMonth() + 1);
    const day = pad(dt.getUTCDate());
    const hours = pad(dt.getUTCHours());
    const mins = pad(dt.getUTCMinutes());
    const secs = pad(dt.getUTCSeconds());

    const date = `${day}/${month}/${year}`;
    const time = `${hours}:${mins}:${secs}`;

    formattedDateTime = `${date} ${time}`;
  }

  return formattedDateTime;

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

  //Parse both timestamps to get time in milliseconds
  const startedAt = Date.parse(startTime);
  const endedAt   = Date.parse(endTime);

  let result: string;

  // If either parse failed, produce an error message
  if (isNaN(startedAt) || isNaN(endedAt)) {
    result = "Invalid date";
  } else {
    // Compute absolute delta in seconds
    let delta = Math.abs(endedAt - startedAt) / 1000;

    // Break into components
    const hours   = Math.floor(delta / 3600);
    delta         -= hours * 3600;
    const minutes = Math.floor(delta / 60);
    const seconds = Math.round((delta - minutes * 60) * 10) / 10;

    // Skipping zero units (except we always show seconds if everything else is zero)
    const parts: string[] = [];
    if (hours   > 0) parts.push(`${hours} hr${hours   !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes !== 1 ? "s" : ""}`);
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} sec${seconds !== 1 ? "s" : ""}`);
    }

    result = parts.join(" ");
  }

  return result;
}
