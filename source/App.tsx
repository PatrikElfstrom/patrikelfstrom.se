import { CSSObject, Global } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ReactElement, Suspense } from 'react';
import { Home } from './components/Home';
import { MetaTags } from './components/MetaTags';

const Triangles = React.lazy(() => import('./components/Triangles/Triangles'));

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  height: '100vh',
});

const bodyStyles: CSSObject = {
  fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif',
};

const Loading = (): ReactElement => <div>Loading...</div>;

export const App = (): ReactElement => (
  <>
    <Global
      styles={{
        body: bodyStyles,
      }}
    />
    <MetaTags />
    <Wrapper>
      <Home />
    </Wrapper>
    <Suspense fallback={<Loading />}>
      <Triangles />
    </Suspense>
  </>
);
