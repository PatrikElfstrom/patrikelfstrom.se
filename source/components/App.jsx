import React, { Suspense, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styles from './App.css';
import offliner from './ServiceWorker';

import '../images/icons/android-chrome-192x192.png';
import '../images/icons/mstile-150x150.png';
import '../images/icons/android-chrome-512x512.png';

const TriangleBackground = React.lazy(() => import('./Triangles'));

const App = () => {
  useEffect(() => {
    offliner();
  });

  return (
    <>
      <div id="wrapper" className={styles.wrapper}>
        <Helmet>
          <html lang="en-SE" className={styles.html} />
          <body className={styles.body} />
        </Helmet>
        <header className={styles.header}>
          <h1 className={styles.h1}>Patrik Elfström</h1>
        </header>
        <main id="site" className={styles.main}>
          <a className={styles.a} href="mailto:me@patrikelfstrom.se">
            me@patrikelfstrom.se
          </a>
        </main>
        <footer className={styles.footer}>
          <small className={styles.small}>Web Developer</small>
        </footer>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <TriangleBackground />
      </Suspense>
    </>
  );
};

export default App;
