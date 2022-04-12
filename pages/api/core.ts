import { ServerResponse } from 'http';
import { setCookie } from 'nookies';
import { GetServerSidePropsContext } from 'next';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const Host =
  typeof window !== 'undefined'
    ? new URL('/api/', location.origin) + ''
    : process.env.NEXT_PUBLIC_API_HOST;

export async function request<T>(
  path: string,
  method?: HTTPMethod,
  body?: any,
  context?: Partial<GetServerSidePropsContext>,
  headers: Record<string, any> = {},
) {
  const token = context?.req && readCookie(context.req, 'token');

  if (token) headers.Authorization = `token ${token}`;

  try {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  } catch {}

  const response = await fetch(new URL(path, Host) + '', {
    method,
    body,
    headers,
  });

  const data = await response.json();

  if (response.status > 299) {
    if (context?.res) {
      context.res.statusCode = response.status;
      context.res.statusMessage = response.statusText;
      context.res.end(JSON.stringify(data));
    }
    throw new URIError(response.statusText);
  }
  return data as T;
}

const Env = process.env.NODE_ENV;

export function writeCookie(
  res: ServerResponse,
  key: string,
  value: string,
  expiredAt: string,
) {
  setCookie({ res }, key, value, {
    httpOnly: true,
    secure: Env !== 'development',
    maxAge: +new Date(expiredAt) - Date.now(),
    path: '/',
  });
}

export function readCookie(req: GetServerSidePropsContext['req'], key: string) {
  return req.cookies[key];
}
