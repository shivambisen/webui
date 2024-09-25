/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import Token from "./Token";

export default interface TokenRequestModalProps {
    tokens: Set<Token>;
    selectedTokens: Set<string>;
    deleteTokenFromSet: Function;
    updateDeleteModalState: Function;
}