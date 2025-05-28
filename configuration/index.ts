import { parseCookie } from 'mobx-i18n';

export const isServer = () => typeof window === 'undefined';

export const Name = process.env.NEXT_PUBLIC_SITE_NAME,
  Summary = process.env.NEXT_PUBLIC_SITE_SUMMARY;

export const { JWT_SECRET, GITHUB_PAT, VERCEL } = process.env;

export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export const { token, JWT } = (globalThis.document ? parseCookie() : {}) as Record<
  'token' | 'JWT',
  string
>;
