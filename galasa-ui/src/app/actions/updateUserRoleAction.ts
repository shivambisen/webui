/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use server';

import { UsersAPIApi } from "@/generated/galasaapi";
import { createAuthenticatedApiConfiguration } from "@/utils/api";
import * as Constants from "@/utils/constants";
import { UpdateUserRolePayload } from "@/utils/interfaces";


export async function updateUserRoleAction(
  requestBody: UpdateUserRolePayload
): Promise<{ status: number; message: string }> {
  if (!requestBody.userNumber || !requestBody.roleDetails?.role) {
    throw new Error('Role ID and User Number are required');
  }

  const apiConfig = createAuthenticatedApiConfiguration();
  const usersApiClient = new UsersAPIApi(apiConfig);

  try {
    
    await usersApiClient.updateUser(
      requestBody.userNumber,
      requestBody.roleDetails,
      Constants.CLIENT_API_VERSION
    );

    return { status: 200, message: 'User role updated successfully' };
  } catch (error: any) {
    console.error(error);

    if (error.response?.status === 403) {
      throw new Error('Forbidden: You do not have permission to update this user.');
    } else if (error.response?.status === 404) {
      throw new Error('Not Found: The specified user does not exist.');
    }
    throw new Error('Internal Server Error');
  }
}
