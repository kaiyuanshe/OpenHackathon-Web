import { Container, Image, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';

const Name = process.env.NEXT_PUBLIC_SITE_NAME || '';

const MainNavigation = () => {
  return <Navbar bg="dark" variant="dark" fixed="top">
    <Container>
      <Navbar.Brand href="/">
        <Image
          className="align-top me-3"
          style={{ width: '2rem' }}
          src="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
        />
        {Name}
      </Navbar.Brand>
      <Nav className="me-auto">
        <Link href="/component" passHref>
          <Nav.Link>Component</Nav.Link>
        </Link>
        <Link
          href="https://github.com/kaiyuanshe/OpenHackathon-Web"
          passHref
        >
          <Nav.Link target="_blank">开源代码</Nav.Link>
        </Link>
      </Nav>
    </Container>
  </Navbar>
};

export default MainNavigation;