/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { UsersAPIApi } from "@/generated/galasaapi";
import { createApiConfiguration, createAuthenticatedApiConfiguration } from './api';
import { cookies } from "next/headers";
import AuthCookies from "./authCookies";

const GALASA_API_SERVER_URL = process.env.GALASA_API_SERVER_URL ?? '';

export const userApiClient = new UsersAPIApi(createApiConfiguration(GALASA_API_SERVER_URL));

export const getUserApiClientWithAuthHeader = () => {
    const bearerTokenCookie = cookies().get(AuthCookies.ID_TOKEN);
    if (!bearerTokenCookie) {
        throw new Error('Unable to get bearer token, please re-authenticate');
    }
    return new UsersAPIApi(createAuthenticatedApiConfiguration(GALASA_API_SERVER_URL, bearerTokenCookie.value));
};

export const getUserData = async () => {

    const userRequestUrl = "/users?loginId=me"

    return await fetch(new URL(userRequestUrl, GALASA_API_SERVER_URL))

}