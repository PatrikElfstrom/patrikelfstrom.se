import styled from '@emotion/styled';
import { ReactElement } from 'react';
import { GithubMark } from './GithubMark';

const breakpoints = [800];
const mq = breakpoints.map((bp) => `@media (min-height: ${bp}px)`);

const Wrapper = styled.div({
  height: '40vh',
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-end',
  [mq[0]]: {
    height: '50vh',
  },
  '& ::selection': {
    backgroundColor: '#092b3f',
    color: '#fff',
  },
});

const Header = styled.header({
  margin: '0.5rem',
  [mq[0]]: {
    margin: '0.75rem',
  },
});

const Heading = styled.h1({
  color: '#fff',
  margin: 0,
});

const Main = styled.main({
  margin: '0.5rem',
  [mq[0]]: {
    margin: '0.75rem',
  },
});

const Footer = styled.footer({
  margin: '0.5rem',
  [mq[0]]: {
    margin: '0.75rem',
  },
});

const Small = styled.small({
  color: '#949494',
});

const Aside = styled.aside({
  marginTop: 'auto',
  marginBottom: '45px',
  a: {
    opacity: 0.3,
  },
});

const Link = styled.a({
  opacity: 0.75,
  color: '#fff',
  textDecoration: 'none',
  transition: 'opacity 200ms ease-in-out',
  '&:hover': {
    opacity: 1,
  },
});

export const Home = (): ReactElement => (
  <Wrapper>
    <Header>
      <Heading>Patrik Elfström</Heading>
    </Header>
    <Main id="site">
      <Link href="mailto:me@patrikelfstrom.se">me@patrikelfstrom.se</Link>
    </Main>
    <Footer>
      <Small>Web Developer</Small>
    </Footer>
    <Aside>
      <Link href="https://github.com/PatrikElfstrom" target="_blank">
        <GithubMark />
      </Link>
    </Aside>
  </Wrapper>
);
