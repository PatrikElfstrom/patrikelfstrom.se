import React from 'react';
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { App } from './App';

const emotionCache = createCache({
  key: 'css',
  nonce: '2f470j1jfg',
});

ReactDOM.render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <App />
    </CacheProvider>
  </React.StrictMode>,
  document.querySelector('#root'),
);
