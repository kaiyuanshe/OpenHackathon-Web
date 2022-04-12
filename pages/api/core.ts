import { ServerResponse } from 'http';
import { setCookie } from 'nookies';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

import { getClientSession } from './user/session';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const BackHost = process.env.NEXT_PUBLIC_API_HOST;
const Host =
  typeof window !== 'undefined'
    ? new URL('/api/', location.origin) + ''
    : BackHost;

export class HTTPError<T> extends URIError {
  status: number;
  header?: Record<string, string>;
  body: T;

  constructor(message: string, status: number, body: T, header?: Headers) {
    super(message);

    this.status = status;

    if (header)
      this.header = Object.fromEntries(
        [...header].map(([key, value]) => [key, value]),
      );
    this.body = body;
  }
}

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

  const data = response.status !== 204 ? await response.json() : {};

  if (response.status < 300) return data as T;

  const { status, statusText, headers: header } = response;

  throw new HTTPError(statusText, status, data, header);
}

export async function requestClient<T>(
  path: string,
  method?: HTTPMethod,
  body?: any,
  headers: Record<string, any> = {},
) {
  try {
    const { token } = await getClientSession();

    return request<T>(
      new URL(path, BackHost) + '',
      method,
      body,
      {},
      { Authorization: `token ${token}`, ...headers },
    );
  } catch (error) {
    if (error instanceof HTTPError)
      location.href = error.status ? '/user/sign-in' : `/${error.status}`;

    throw error;
  }
}

export type NextAPI = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>;

export function safeAPI(handler: NextAPI): NextAPI {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      if (error instanceof HTTPError) {
        res.status(error.status);
        res.statusMessage = error.message;
        res.send(error.body);
      }
    }
  };
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
