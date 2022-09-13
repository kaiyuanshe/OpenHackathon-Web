import { Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';

import { UserBar } from '../UserBar';

const Name = process.env.NEXT_PUBLIC_SITE_NAME || '';

export const MainNavigation = () => (
  <Navbar bg="dark" variant="dark" fixed="top" expand="md">
    <Container>
      <Navbar.Brand href="/">
        <img
          className="align-top me-3"
          style={{ width: '2rem' }}
          src="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
        />
        {Name}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-inner" />

      <Navbar.Collapse id="navbar-inner">
        <Nav className="me-auto">
          <Link href="/activity/" passHref>
            <Nav.Link>所有比赛</Nav.Link>
          </Link>
          <Link
            href="https://github.com/kaiyuanshe/open-hackathon/wiki/%E5%BC%80%E6%94%BE%E9%BB%91%E5%AE%A2%E6%9D%BE%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97"
            passHref
          >
            <Nav.Link target="_blank">新手帮助</Nav.Link>
          </Link>
          <Link href="https://github.com/kaiyuanshe/OpenHackathon-Web" passHref>
            <Nav.Link target="_blank">开源代码</Nav.Link>
          </Link>
        </Nav>

        <UserBar />
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
