import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Triangles from './Triangles';
import styles from './App.css';
import offliner from './ServiceWorker';
import './SnackBar';
import '../images/icons/android-chrome-192x192.png';
import '../images/icons/mstile-150x150.png';
import '../images/icons/android-chrome-512x512.png';

export default class App extends Component {
  constructor() {
    super();
    this.snackbar = React.createRef();
    this.showSnack = this.showSnack.bind(this);

    offliner(this.showSnack);
  }

  showSnack(message, options) {
    if (!this.snackbar.current) throw Error('Snackbar missing');
    return this.snackbar.current.showSnackbar(message, options);
  }

  render() {
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
        <snack-bar ref={this.snackbar} />
        <Triangles />
      </>
    );
  }
}
