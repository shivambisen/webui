/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
"use server";

import { UsersAPIApi } from "@/generated/galasaapi";
import * as Constants from "@/utils/constants";
import { createAuthenticatedApiConfiguration } from '@/utils/api';


export const deleteUserFromService = async (userNumber: string) => {

  if (!userNumber) {
    throw new Error('User Number is required');
  }

  const apiConfig = createAuthenticatedApiConfiguration();
  const usersApiClient = new UsersAPIApi(apiConfig);

  try {

    await usersApiClient.deleteUserByNumber(userNumber, Constants.CLIENT_API_VERSION);

  } catch (error: any) {
    console.error(error);

    if (error.response?.status === 403) {
      throw new Error('Forbidden: You do not have permission to delete this user.');
    } else if (error.response?.status === 404) {
      throw new Error('Not Found: The specified user does not exist.');
    }
    throw new Error('Internal Server Error');
  }
};