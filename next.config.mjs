import withLess from 'next-with-less';
import setPWA from 'next-pwa';

const { NODE_ENV, CI } = process.env;

const withPWA = setPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
export default {
  ...withPWA(withLess({ reactStrictMode: true })),
  output: CI && 'standalone',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  transpilePackages: ['@sentry/browser'],
};
