import { t } from 'i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';

const UserBar = dynamic(() => import('../User/UserBar'), { ssr: false });
export const MainNavigation = () => (
  <Navbar bg="dark" variant="dark" fixed="top" expand="md">
    <Container>
      <Navbar.Brand href="/">
        {/* <Image
          className="align-top me-3"
          style={{ width: '2rem' }}
          src="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
          alt="logo"
        /> */}
        {t('open_hackathon_platform')}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-inner" />

      <Navbar.Collapse id="navbar-inner">
        <Nav className="me-auto">
          <Link href="/activity/" passHref>
            <Nav.Link>{t('all_activity')}</Nav.Link>
          </Link>
          <Link
            href="https://github.com/kaiyuanshe/open-hackathon/wiki/%E5%BC%80%E6%94%BE%E9%BB%91%E5%AE%A2%E6%9D%BE%E5%B9%B3%E5%8F%B0%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97"
            passHref
          >
            <Nav.Link target="_blank">{t('get_started')}</Nav.Link>
          </Link>
          <Link href="https://github.com/kaiyuanshe/OpenHackathon-Web" passHref>
            <Nav.Link target="_blank">{t('open-source-code')}</Nav.Link>
          </Link>
        </Nav>

        <UserBar />
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
