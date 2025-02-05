/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import React from 'react';
import { HeaderGlobalBar, OverflowMenu, OverflowMenuItem, HeaderName } from '@carbon/react';
import { User } from "@carbon/icons-react";
import { useRouter } from 'next/navigation';
import { handleDeleteCookieApiOperation } from '@/utils/functions';

function PageHeaderMenu({ galasaServiceName }: { galasaServiceName: string }) {

  const router = useRouter();

  const handleRedirectToMyProfilePage = () => {
    router.push("/myprofile");
  };

  const handleRedirectToMySettingsPage = () => {
    router.push("/mysettings");
  };

  return (
    <HeaderGlobalBar data-testid="header-menu">

      <HeaderName prefix="">{galasaServiceName}</HeaderName>

      <OverflowMenu
        data-floating-menu-container
        selectorPrimaryFocus={'.optionOne'}
        renderIcon={User}
        data-testid='menu-btn'
        size='lg'
        flipped={true}
      >
        <OverflowMenuItem
          itemText="My Profile"
          data-testid='my-profile-btn'
          onClick={handleRedirectToMyProfilePage}
        />
        <OverflowMenuItem
          itemText="My Settings"
          data-testid='my-settings-btn'
          onClick={handleRedirectToMySettingsPage}
        />
        <OverflowMenuItem
          itemText="Log out"
          onClick={() => handleDeleteCookieApiOperation(router)}
          data-testid='logout-btn'
        />

      </OverflowMenu>

    </HeaderGlobalBar>
  );
}

export default PageHeaderMenu;