/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
export interface FrontEndClient {
    clientName: string;
    lastLogin: string; // Use `Date` type if you want to work directly with Date objects
}