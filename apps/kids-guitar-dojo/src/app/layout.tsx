import '../styles/navbar.scss';
import './global.scss';
import { Raleway } from 'next/font/google';
import { Suspense } from 'react';
import { BackToTop, Navbar } from '@rocket-house-productions/layout';
import { GoogleAnalytics } from '@rocket-house-productions/util';

// eslint-disable-next-line @nx/enforce-module-boundaries
import logo from '@assets/logo.png';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createClient } from '@/prismicio';
import NextTopLoader from 'nextjs-toploader';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export const metadata = {
  title: 'Welcome to kids-guitar-dojo',
  description: 'Generated by create-nx-workspace',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const client = createClient();
  const navigation = await client.getSingle('navigation');

  console.log(navigation.data);

  return (
    <html lang="en" className={`${raleway.variable} font-sans`}>
      <body>
        {/* Loadingbar */}
        <NextTopLoader color={'var(--color-primary)'} height={5} showSpinner={false} shadow={false} />

        {/* Menu header */}
        <Navbar items={navigation.data.links} logo={logo} />

        {children}

        {/* BackToTop */}
        <BackToTop />
        <Suspense>
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_GOOGLE_ANALYTICS_ID || ''} />
        </Suspense>
      </body>
    </html>
  );
}
