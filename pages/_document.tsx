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
        <script src="https://polyfill.kaiyuanshe.cn/feature/EventSubmitter.js"></script>

        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap@5.2.2/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/idea-react@0.27.10/dist/index.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/bootstrap-icons@1.10.2/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
