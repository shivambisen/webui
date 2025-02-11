/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UserData, UsersAPIApi } from '@/generated/galasaapi';
import { createAuthenticatedApiConfiguration } from '@/utils/api';
import React from 'react';
import * as Constants from "@/utils/constants";
import BreadCrumb from '@/components/common/BreadCrumb';
import PageTile from '@/components/PageTile';
import UsersList from '@/components/users/UsersTable';

export const dynamic = 'force-dynamic';

function UsersPage() {

  const apiConfig = createAuthenticatedApiConfiguration();
  const fetchAllUsersFromApiServer = async () => {

    let users : UserData[] = [];

    const usersApiClient = new UsersAPIApi(apiConfig);
    const usersReponse = await usersApiClient.getUserByLoginId(Constants.CLIENT_API_VERSION);

    if(usersReponse && usersReponse.length >= 1){
      users = structuredClone(usersReponse);
    }

    return users;

  };

  return (
    <main id="content">
      <BreadCrumb />
      <PageTile title={"Users"} />
      <UsersList usersListPromise={fetchAllUsersFromApiServer()}/>
    </main>
  );
}

export default UsersPage;