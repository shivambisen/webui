/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */
import AuthCookies from '@/utils/authCookies';
import { cookies } from 'next/headers';
import MySettingsPage from '@/components/MySettingsPage';
import TokenResponseModal from '@/components/tokens/TokenResponseModal';


export default function MySettings() {

  const clientId = cookies().get(AuthCookies.CLIENT_ID)?.value ?? '';
  const refreshToken = cookies().get(AuthCookies.REFRESH_TOKEN)?.value ?? '';

  // Server Action to delete auth-related cookies
  const deleteCookies = async () => {
    'use server';

    cookies().delete(AuthCookies.CLIENT_ID);
    cookies().delete(AuthCookies.REFRESH_TOKEN);
  };

  return (
    <main>
      <MySettingsPage />
      <TokenResponseModal refreshToken={refreshToken} clientId={clientId} onLoad={deleteCookies} />
    </main>
  );
};