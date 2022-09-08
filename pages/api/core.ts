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
  method: Request['method'] = 'GET',
  body?: any,
  context?: Partial<GetServerSidePropsContext>,
  headers: Record<string, any> = {},
): Promise<T> {
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

/**
 * 客户端直接请求后端
 */
export async function requestClient<T = void>(
  path: string,
  method: Request['method'] = 'GET',
  body?: any,
  headers: Record<string, any> = {},
) {
  try {
    const { token } = (await getClientSession()) || {};

    headers = { Authorization: `token ${token}`, ...headers };
  } catch {}

  try {
    return request<T>(new URL(path, BackHost) + '', method, body, {}, headers);
  } catch (error) {
    if (error instanceof HTTPError)
      location.href =
        error.status === 401 ? '/user/sign-in' : `/${error.status}`;

    throw error;
  }
}

/**
 * 上传blob文件
 */
export async function uploadBlob<T = void>(
  fullPath: string,
  method: Request['method'] = 'PUT',
  body?: any,
  headers: Record<string, any> = {},
) {
  headers['x-ms-blob-type'] = 'BlockBlob';

  const { response } = call<T>({
    path: fullPath,
    method,
    body,
    headers,
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
    maxAge: (+new Date(expiredAt) - Date.now()) / 1000,
    path: '/',
  });
}

export function readCookie(req: GetServerSidePropsContext['req'], key: string) {
  return req.cookies[key];
}
