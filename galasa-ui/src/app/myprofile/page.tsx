/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import * as Constants from "@/utils/constants";
import PageTile from "@/components/PageTile";
import { RBACRole, RoleBasedAccessControlAPIApi, UsersAPIApi } from "@/generated/galasaapi";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { createAuthenticatedApiConfiguration } from "@/utils/api";
import UserProfile from "@/utils/interfaces/UserProfile";

export default function MyProfilePage() {
  const apiConfig = createAuthenticatedApiConfiguration();

  const fetchUserRole = async (roleId: string) => {
    const rbacApiClient = new RoleBasedAccessControlAPIApi(apiConfig);
    let userRole: RBACRole = {};
    try {
      userRole = await rbacApiClient.getRBACRole(roleId, Constants.CLIENT_API_VERSION);
    } catch (err) {
      console.error("Failed to get user role. Reason:", err);
    }
    return userRole;
  };

  const fetchUserProfile = async () => {
    let userProfile: UserProfile = {};

    try {
      const usersApiClient = new UsersAPIApi(apiConfig);

      const usersResponse = await usersApiClient.getUserByLoginId(Constants.CLIENT_API_VERSION, "me");

      if (usersResponse && usersResponse.length > 0) {
        // The openapi-generated "UserData" model is generated as a class, which can't be passed down
        // to client components by reference, so deep clone the object
        const currentUser = usersResponse[0];
        userProfile.userData = structuredClone(currentUser);
        if (currentUser.role) {
          const userRole = await fetchUserRole(currentUser.role);
          userProfile.roleName = userRole.metadata?.name;
        }
      }
    } catch (err) {
      console.error("Failed to get profile details. Reason:", err);
      throw new Error("Failed to get profile details");
    }
    return userProfile;
  };

  return (
    <main id="content">
      <PageTile title={"My Profile"} />
      <ProfileDetails userProfilePromise={fetchUserProfile()} />
    </main>
  );
};
