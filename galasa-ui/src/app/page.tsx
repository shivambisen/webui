/*
 * Copyright contributors to the Galasa project
 */
import TokenRequestModal from '@/components/TokenRequestModal';
import TokenResponseModal from '@/components/TokenResponseModal';
import { cookies } from 'next/headers';

export default function HomePage() {
  return (
    <div id="content">
      <TokenRequestModal openState={false} />
      <TokenResponseModal refreshToken={cookies().get('refresh_token')?.value ?? ''} />
    </div>
  );
};
