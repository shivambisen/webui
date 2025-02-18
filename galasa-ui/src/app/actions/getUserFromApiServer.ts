/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UserData, UsersAPIApi } from "@/generated/galasaapi";
import * as Constants from "@/utils/constants";
import { createAuthenticatedApiConfiguration } from '@/utils/api';


export const fetchUserFromApiServer = async (loginId: string) => {

  const apiConfig = createAuthenticatedApiConfiguration();
  let user: UserData = {};
  const usersApiClient = new UsersAPIApi(apiConfig);
  const usersReponse = await usersApiClient.getUserByLoginId(Constants.CLIENT_API_VERSION, loginId);

  if (usersReponse && usersReponse.length > 0) {
    user = structuredClone(usersReponse[0]);
  }

  return user;
};