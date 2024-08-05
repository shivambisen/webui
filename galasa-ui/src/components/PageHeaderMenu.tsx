/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client'

import React from 'react'
import { HeaderGlobalBar, OverflowMenu, OverflowMenuItem, ToastNotification} from '@carbon/react';
import { useState } from 'react';
import {User} from "@carbon/icons-react"
import { useRouter } from 'next/navigation';
import styles from "../styles/Toast.module.css"

function PageHeaderMenu() {

  const router = useRouter()

  const [error, setError] = useState(false);

  const handleDeleteCookieApiOperation = async () => {

    try{

      const response = await fetch('/auth/tokens', { method: 'DELETE' });

      if(response.status === 204){

        //auto refresh page to render dex login page
        router.refresh()

      }

    }catch(err) {
      setError(true)
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


          {
            error && <div data-testid='toast' className={styles.toast}>
              <ToastNotification  role="alert" onCloseButtonClick={() => setError(false)} title={"Something went wrong"} subtitle={"Something went wrong while logging out."}/>
            </div>
          }
          
          
      </HeaderGlobalBar>
  )
}

export default PageHeaderMenu