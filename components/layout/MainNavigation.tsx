import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container, Image, Nav, Navbar } from 'react-bootstrap';

import { i18n } from '../../models/Base/Translation';

const { t } = i18n;

const UserBar = dynamic(() => import('../User/UserBar'), { ssr: false });

export const MainNavigation = () => (
  <Navbar bg="dark" variant="dark" fixed="top" expand="lg" collapseOnSelect>
    <Container>
      <Navbar.Brand href="/">
        <Image
          className="align-top me-3"
          style={{ width: '2rem' }}
          src="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
          alt="logo"
        />
        {t('open_hackathon_platform')}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-inner" />

      <Navbar.Collapse id="navbar-inner">
        <div className="w-100 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
          <Nav className="me-auto">
            <Link href="/activity/" passHref>
              <Nav.Link>{t('all_activity')}</Nav.Link>
            </Link>
            <Nav.Link
              target="_blank"
              href="https://kaiyuanshe.feishu.cn/wiki/wikcnR3wHyfVDrYW2TteaUzAnlh"
            >
              {t('get_started')}
            </Nav.Link>
            <Nav.Link
              target="_blank"
              href="https://github.com/kaiyuanshe/OpenHackathon-Web"
            >
              {t('open_source_code')}
            </Nav.Link>
          </Nav>

          <UserBar />
        </div>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
