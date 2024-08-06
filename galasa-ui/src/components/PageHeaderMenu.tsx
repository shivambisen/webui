/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'

import React from 'react'
import { HeaderGlobalBar, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { useState } from 'react';
import { User } from "@carbon/icons-react"
import { useRouter } from 'next/navigation';

function PageHeaderMenu() {

  const router = useRouter()

  const handleDeleteCookieApiOperation = async () => {

    const response = await fetch('/auth/tokens', { method: 'DELETE' });

    if (response.status === 204) {

      //auto redirect to render dex login page
      router.push("/")

    }
  }

  return (
    <HeaderGlobalBar data-testid="header-menu">

      <OverflowMenu
        data-floating-menu-container
        selectorPrimaryFocus={'.optionOne'}
        renderIcon={User}
        data-testid='menu-btn'
        size='lg'
        flipped={true}
      >
        <OverflowMenuItem
          className="optionOne"
          itemText="Log out"
          onClick={handleDeleteCookieApiOperation}
          data-testid='logout-btn'
        />

      </OverflowMenu>

    </HeaderGlobalBar>
  )
}

export default PageHeaderMenu