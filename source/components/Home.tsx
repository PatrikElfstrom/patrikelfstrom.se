import styled from '@emotion/styled';
import { ReactElement } from 'react';

const Wrapper = styled.div({
  position: 'absolute',
  top: '75%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '& ::selection': {
    backgroundColor: '#092b3f',
    color: '#fff',
  },
});

const Header = styled.header({
  margin: '1rem',
});

const Heading = styled.h1({
  color: '#fff',
  margin: 0,
  fontWeight: 800,
});

const Main = styled.main({
  margin: '1rem',
});

const Link = styled.a({
  color: '#cacaca',
  textDecoration: 'none',
  transition: 'color 200ms ease-in-out',
  '&:hover': {
    color: '#fff',
  },
});

const Footer = styled.footer({
  margin: '1rem',
});

const Small = styled.small({
  color: '#949494',
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
  </Wrapper>
);
