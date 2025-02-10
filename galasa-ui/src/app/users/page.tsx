/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UserData, UsersAPIApi } from '@/generated/galasaapi';
import { createAuthenticatedApiConfiguration } from '@/utils/api';
import React, { useEffect } from 'react';
import * as Constants from "@/utils/constants";
import BreadCrumb from '@/components/common/BreadCrumb';
import PageTile from '@/components/PageTile';
import UsersList from '@/components/users/UsersList';

export const dynamic = 'force-dynamic';

function UsersPage() {

  const apiConfig = createAuthenticatedApiConfiguration();
  const fetchAllUsersInEcosystem = async () => {

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
      <UsersList usersListPromise={fetchAllUsersInEcosystem()}/>
    </main>
  );
}

export default UsersPage;