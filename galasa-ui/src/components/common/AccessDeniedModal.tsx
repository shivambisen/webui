/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

'use client';

import React from 'react';
import { Modal, InlineNotification } from "@carbon/react";
import { handleDeleteCookieApiOperation } from '@/utils/functions';
import { useRouter } from 'next/navigation';

function AccessDeniedModal() {

  const router = useRouter();

  return (
    <Modal
      modalHeading="Insufficient Permissions"
      primaryButtonText="Log out"
      open={true}
      onRequestSubmit={async () => {
        await handleDeleteCookieApiOperation(router);
      }}
      onRequestClose={async () => {
        await handleDeleteCookieApiOperation(router);
      }}
    >

      <div className='margin-top-2'>
        <InlineNotification
          subtitle="You have access to the Galasa service, but your user role does not have sufficient permissions to perform this operation."
          kind="warning"
          lowContrast
          hideCloseButton
        />

        <p className='margin-top-2'>If this is a problem, contact your Galasa service administrator and ask to be assigned a different role which will give you the permission.</p>
      </div>

    </Modal>
  );
}

export default AccessDeniedModal;