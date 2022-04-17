import { ServerResponse } from 'http';
import { HTTPError, Request, request as call } from 'koajax';
import { setCookie } from 'nookies';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

import { getClientSession } from './user/session';
import { ErrorData } from '../../models/Base';

const BackHost = process.env.NEXT_PUBLIC_API_HOST;
const Host =
  typeof window !== 'undefined'
    ? new URL('/api/', location.origin) + ''
    : BackHost;

export async function request<T = void>(
  path: string,
  method?: Request['method'],
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

  const { response } = call<T>({
    path: new URL(path, Host) + '',
    method,
    body,
    headers,
    responseType: 'json',
  });
  const { headers: header, body: data } = await response;

  if (!data || !('traceId' in data)) return data!;

  const { status, title, detail } = data as unknown as ErrorData;

  throw new HTTPError(detail || title, {
    status,
    statusText: title,
    headers: header,
    body: data,
  });
}

export async function requestClient<T = void>(
  path: string,
  method?: Request['method'],
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
      location.href =
        error.status === 401 ? '/user/sign-in' : `/${error.status}`;

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
