/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use server'

import { cookies } from "next/headers"
import AuthCookies from "../authCookies"


const fetchClientIdAndRefreshToken = async () => {

    const clientId: string = cookies().get(AuthCookies.CLIENT_ID)?.value || ""
    const refreshToken: string = cookies().get(AuthCookies.REFRESH_TOKEN)?.value || ""

    const cookiesToReturn = {
        clientId: clientId,
        refreshToken: refreshToken
    }

    return cookiesToReturn;

}

const deleteClientIdAndRefreshToken = async () => {

    cookies().delete(AuthCookies.CLIENT_ID);
    cookies().delete(AuthCookies.REFRESH_TOKEN);

}

export {fetchClientIdAndRefreshToken, deleteClientIdAndRefreshToken};