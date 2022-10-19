import { ParsedUrlQuery } from 'querystring';
import { HTTPError, Request, request as call } from 'koajax';
import {
  NextApiRequest,
  NextApiResponse,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';

import { ErrorData } from '../../models/Base';

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

interface RouteProps<T extends ParsedUrlQuery> {
  route: Pick<
    GetServerSidePropsContext<T>,
    'resolvedUrl' | 'params' | 'query' | 'locales'
  >;
}

export function withRoute<
  R extends Record<string, any>,
  P extends Record<string, any> = {},
  O extends GetServerSideProps<P, R> = GetServerSideProps<P, R>,
>(
  origin?: O,
): GetServerSideProps<RouteProps<R> & InferGetServerSidePropsType<O>, R> {
  return async context => {
    const options =
        (await origin?.(context)) || ({} as GetServerSidePropsResult<{}>),
      { resolvedUrl, params, query, locales } = context;

    return {
      ...options,
      props: {
        ...('props' in options ? options.props : {}),
        route: JSON.parse(
          JSON.stringify({ resolvedUrl, params, query, locales }),
        ),
      },
    } as GetServerSidePropsResult<
      RouteProps<R> & InferGetServerSidePropsType<O>
    >;
  };
}
