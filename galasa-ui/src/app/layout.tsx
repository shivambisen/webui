/*
 * Copyright contributors to the Galasa project
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { getClientApiVersion, getServiceHealthStatus } from '@/utils/health';
import { NextIntlClientProvider } from 'next-intl';
import Footer from '@/components/Footer';
import PageHeader from '@/components/headers/PageHeader';
import '@/styles/global.scss';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';
import { cookies } from 'next/headers';
import FeatureFlagCookies from '@/utils/featureFlagCookies';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const dynamic = "force-dynamic";
type ThemeType = "white" | "g100"; 

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  const galasaServiceName = process.env.GALASA_SERVICE_NAME?.trim() || "Galasa Service";
  const featureFlagsCookie = cookies().get(FeatureFlagCookies.FEATURE_FLAGS)?.value;
  const themeCookie = cookies().get('preferred-theme')?.value;
  const initialTheme: ThemeType = themeCookie === 'g100' ? 'g100' : 'white'; // safe fallback

  return (
    <html lang={locale} data-carbon-theme={initialTheme}>
      <head>
        <title>{galasaServiceName}</title>
        <meta name="description" content="Galasa Ecosystem Web UI" />
      </head>
      <body>
        <NextIntlClientProvider>
          <FeatureFlagProvider initialFlags={featureFlagsCookie}>
            <ThemeProvider initialTheme={initialTheme}>
              <PageHeader galasaServiceName={galasaServiceName} />
              {children}
              <Footer serviceHealthyPromise={getServiceHealthStatus()}clientVersionPromise={getClientApiVersion()}/>
            </ThemeProvider>
          </FeatureFlagProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
