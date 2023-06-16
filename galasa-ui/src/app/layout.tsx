/*
 * Copyright contributors to the Galasa project
 */
import '../styles/global.scss';
import { verifyAuthenticated } from './auth/route';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  verifyAuthenticated();

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
