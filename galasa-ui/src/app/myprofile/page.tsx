/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import PageTile from "@/components/PageTile";
import ProfileDetails from "@/components/profile/ProfileDetails";
import BreadCrumb from "@/components/common/BreadCrumb";
import { fetchCurrentUserFromApiServer } from "../actions/getLoggedInUserAction";

export default function MyProfilePage() {

  return (
    <main id="content">
      <BreadCrumb />
      <PageTile title={"My Profile"} />
      <ProfileDetails userProfilePromise={fetchCurrentUserFromApiServer()} />
    </main>
  );
};
