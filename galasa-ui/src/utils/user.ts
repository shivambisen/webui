/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import { UsersAPIApi } from "@/generated/galasaapi";
import { createApiConfiguration } from './api';

const GALASA_API_SERVER_URL = process.env.GALASA_API_SERVER_URL ?? '';

export const userApiClient = new UsersAPIApi(createApiConfiguration(GALASA_API_SERVER_URL));

export const getUserData = async () => {

    const userRequestUrl = "/users?loginId=me"

    return await fetch(new URL(userRequestUrl, GALASA_API_SERVER_URL))

}