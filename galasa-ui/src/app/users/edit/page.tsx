/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import EditUserBreadCrumb from '@/components/common/EditUserBreadCrumb';
import PageTile from '@/components/PageTile';
import UserRoleSection from '@/components/users/UserRoleSection';
import React from 'react';
import { RBACRole, RoleBasedAccessControlAPIApi} from '@/generated/galasaapi';
import { createAuthenticatedApiConfiguration } from '@/utils/api';
import AccessTokensSection from '@/components/AccessTokensSection';
import { fetchAccessTokens } from '@/app/actions/getUserAccessTokens';
import { fetchUserFromApiServer } from '@/app/actions/userServerActions';

// In order to extract query param on server-side
type UsersPageProps = {
  params: {}; // No dynamic route parameters
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function EditUserPage({ searchParams }: UsersPageProps) {

  const loginIdFromQueryParam = searchParams.loginId as string;

  const apiConfig = createAuthenticatedApiConfiguration();

  const fetchRBACRolesFromApiServer = async () => {

    let roles: RBACRole[] = [];

    const rbacApiClient = new RoleBasedAccessControlAPIApi(apiConfig);
    const rolesReponse = await rbacApiClient.getRBACRoles();

    if(rolesReponse && rolesReponse.length >= 1){
      roles = structuredClone(rolesReponse);
    }

    return roles;

  };

  return (
    <main id="content">
      <EditUserBreadCrumb />
      <PageTile title={"Edit User"} />
      <UserRoleSection userProfilePromise={fetchUserFromApiServer(loginIdFromQueryParam)} roleDetailsPromise={fetchRBACRolesFromApiServer()}/>
      <AccessTokensSection accessTokensPromise={fetchAccessTokens(loginIdFromQueryParam)} isAddBtnVisible={false}/>
    </main>
  );
}
