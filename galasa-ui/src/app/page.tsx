/*
 * Copyright contributors to the Galasa project
 */
'use client';

import TokenRequestModal from '@/components/Modals';
import { Button } from '@carbon/react';
import { useState } from 'react';

export default function HomePage() {
  return (
    <div>
      <TokenRequestModal />
    </div>
  );
};
