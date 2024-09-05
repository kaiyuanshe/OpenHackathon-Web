// @ts-ignore
import withLess from 'next-with-less';
import setPWA from 'next-pwa';
import WP from 'webpack';

const { NODE_ENV, CI } = process.env;

const withPWA = setPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: NODE_ENV === 'development',
});

/**
 * @type {import('next').NextConfig['webpack']}
 */
const webpack = config => {
  config.plugins.push(
    new WP.NormalModuleReplacementPlugin(/^node:/, resource => {
      resource.request = resource.request.replace(/^node:/, '');
    }),
  );
  return config;
};

/**
 * @type {import('next').NextConfig['rewrites']}
 */
const rewrites = async () => ({
  beforeFiles: [
    {
      source: '/proxy/github.com/:path*',
      destination: 'https://github.com/:path*',
    },
    {
      source: '/proxy/raw.githubusercontent.com/:path*',
      destination: 'https://raw.githubusercontent.com/:path*',
    },
  ],
  afterFiles: [],
  fallback: [],
});

/** @type {import('next').NextConfig} */
export default withLess(
  withPWA({
    reactStrictMode: true,
    output: CI ? 'standalone' : undefined,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    transpilePackages: ['@sentry/browser'],
    webpack,
    rewrites,
  }),
);
