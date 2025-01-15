/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { UserData } from "@/generated/galasaapi";

interface UserProfile {
  userData?: UserData;
  roleName?: string;
}

export default UserProfile;