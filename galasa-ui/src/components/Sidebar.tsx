/*
 * Copyright contributors to the Galasa project
 */
'use client';

import { SideNav, SideNavItems, SideNavLink } from '@carbon/react';

export default function Sidebar (){
  return (
    <SideNav aria-label="Sidebar">
      <SideNavItems>
        <SideNavLink href="#">Home</SideNavLink>
        <SideNavLink href="#">About</SideNavLink>
        <SideNavLink href="#">Contact</SideNavLink>
      </SideNavItems>
    </SideNav>
  );
};