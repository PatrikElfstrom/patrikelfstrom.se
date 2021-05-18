import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
import structuredData from '../static/structuredData.json';

export const MetaTags = (): ReactElement => {
  const { origin } = window.location;

  return (
    <Helmet>
      <title>{structuredData.mainEntityOfPage.name}</title>
      <meta name="description" content={structuredData.mainEntityOfPage.description} />
      <link rel="canonical" href={origin} />

      <meta property="og:image" content="/images/icons/patrikelfstrom-logo-1200x1200.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image:alt" content="Patrik Elfström logotype" />
      <meta property="og:url" content={origin} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary" />

      <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
      <link rel="mask-icon" href="/images/icons/safari-pinned-tab.svg" color="#0084c7" />

      <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#ffffff" />

      <link rel="author" href="/humans.txt" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};
