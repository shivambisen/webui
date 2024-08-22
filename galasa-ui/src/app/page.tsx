/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import HomeContent from '@/components/HomeContent';
import PageTile from '@/components/PageTile';
import TokenRequestModal from '@/components/TokenRequestModal';
import TokenResponseModal from '@/components/TokenResponseModal';
import AuthCookies from '@/utils/authCookies';
import { cookies } from 'next/headers';


export default function HomePage() {

  const clientId = cookies().get(AuthCookies.CLIENT_ID)?.value ?? '';
  const refreshToken = cookies().get(AuthCookies.REFRESH_TOKEN)?.value ?? '';

  // Server Action to delete auth-related cookies
  const deleteCookies = async () => {
    'use server';

    cookies().delete(AuthCookies.CLIENT_ID);
    cookies().delete(AuthCookies.REFRESH_TOKEN);
  };

  return (
    <div id="content">
      <PageTile data-testid="page-tile" title={"Home"} />
      <TokenRequestModal />
      <TokenResponseModal refreshToken={refreshToken} clientId={clientId} onLoad={deleteCookies} />
      <HomeContent />
    </div>
  );
};
