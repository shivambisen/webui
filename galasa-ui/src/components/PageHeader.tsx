/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
'use client';

import { Header, HeaderName , SkipToContent} from '@carbon/react';
import styles from "../styles/Header.module.css"

export default function PageHeader() {
  
  let galasaServiceName = process.env.NEXT_PUBLIC_GALASA_SERVICE_NAME?.trim() || "Galasa Service"

  return (
    <Header aria-label="Galasa Ecosystem">
      <SkipToContent />
      <HeaderName prefix="">{galasaServiceName}</HeaderName>
    </Header>
  );
};