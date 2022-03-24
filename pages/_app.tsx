import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { Container, Button, Image, Nav, Navbar } from 'react-bootstrap';

import '../styles/globals.less';

const Name = process.env.NEXT_PUBLIC_SITE_NAME || '';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <Image
              className="align-top me-3"
              style={{ width: '2rem' }}
              src="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
            />
            {Name}
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">
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
            <div>
              <Button href="/user/sign-in/">登录</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>

      <footer className="flex-fill d-flex justify-content-center align-items-center border-top py-4">
        <a
          className="flex-fill d-flex justify-content-center align-items-center"
          href="https://github.com/idea2app/Next-Bootstrap-ts"
          target="_blank"
          rel="noopener noreferrer"
        >
          由
          <span className="mx-2">
            <Image src="/nextjs.png" alt="Next Logo" width={48} />
          </span>
          idea2app 脚手架强力驱动
        </a>
      </footer>
    </>
  );
}
