/*
 * Copyright contributors to the Galasa project
 */
'use client';

import { Header, HeaderName , SkipToContent} from '@carbon/react';

export default function PageHeader() {
  return (
    <Header aria-label="GALASA">
      <SkipToContent />
      <HeaderName prefix="Galasa Ecosystem">(Experimental)</HeaderName>
    </Header>
  );
};