import { CSSObject, Global } from '@emotion/react';
import { ReactElement, Suspense } from 'react';
import { Home } from './components/Home';
import { MetaTags } from './components/MetaTags';
import { Triangles } from './components/Triangles/Triangles';

const bodyStyles: CSSObject = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif',
};

export const App = (): ReactElement => (
  <>
    <Global
      styles={{
        body: bodyStyles,
      }}
    />
    <MetaTags />
    <Home />
    <Suspense fallback={<div>Loading...</div>}>
      <Triangles />
    </Suspense>
  </>
);
