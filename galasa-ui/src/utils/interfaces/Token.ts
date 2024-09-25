/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

export default interface Token {
    tokenId: string;
    description: string;
    creationTime: string;
    owner: {
        loginId: string;
    };
}