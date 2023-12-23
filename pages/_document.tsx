import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="icon"
          href="https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg"
        />
        <link rel="manifest" href="/manifest.json" />
        <script src="https://polyfill.kaiyuanshe.cn/feature/PWAManifest.js"></script>

        <link
          rel="stylesheet"
          href="https://npm.onmicrosoft.cn/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://npm.onmicrosoft.cn/bootstrap-icons@1.11.2/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://npm.onmicrosoft.cn/leaflet@1.9.4/dist/leaflet.css"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
