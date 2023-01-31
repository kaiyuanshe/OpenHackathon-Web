import { HTTPError, Request, request as call } from 'koajax';
import { parseLanguageHeader } from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { ParsedUrlQuery } from 'querystring';

import { ErrorBaseData } from '../../models/Base';
import { i18n } from '../../models/Translation';

/**
 * 上传blob文件
 */
export async function uploadBlob<T = void>(
  fullPath: string,
  method: Request['method'] = 'PUT',
  body?: any,
  headers: DataObject = {},
) {
  headers['x-ms-blob-type'] = 'BlockBlob';

  const { response } = call<T>({
    path: fullPath,
    method,
    body,
    headers,
  });
  const { headers: header, body: data } = await response;

  if (!data || !('traceId' in (data as DataObject))) return data!;

  const { status, title, detail } = data as unknown as ErrorBaseData;

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
      if (!(error instanceof HTTPError)) {
        console.error(error);
        return res.end(error);
      }
      let { message, status, body } = error;

      res.status(status);
      res.statusMessage = message;

      if (body instanceof ArrayBuffer)
        try {
          body = new TextDecoder().decode(new Uint8Array(body));
          console.error(body);

          body = JSON.parse(body);
          console.error(body);
        } catch {}

      res.send(body);
    }
  };
}

export function withErrorLog<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(origin: F) {
  return (async context => {
    try {
      return await origin(context);
    } catch (error) {
      console.error(error);

      const { status } = error as HTTPError;

      if (status === 404) return { notFound: true, props: {} };

      throw error;
    }
  }) as F;
}

interface RouteProps<T extends ParsedUrlQuery> {
  route: Pick<
    GetServerSidePropsContext<T>,
    'resolvedUrl' | 'params' | 'query' | 'locales'
  >;
}

export function withRoute<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(
  origin?: F,
): GetServerSideProps<RouteProps<I> & InferGetServerSidePropsType<F>, I> {
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
      RouteProps<I> & InferGetServerSidePropsType<F>
    >;
  };
}

export function withTranslation<
  I extends DataObject,
  O extends DataObject = {},
  F extends GetServerSideProps<O, I> = GetServerSideProps<O, I>,
>(
  origin?: F,
): GetServerSideProps<RouteProps<I> & InferGetServerSidePropsType<F>, I> {
  return async context => {
    const { language = '' } = context.req.cookies,
      languages = parseLanguageHeader(
        context.req.headers['accept-language'] || '',
      );
    await i18n.loadLanguages([language, ...languages].filter(Boolean));

    return ((await origin?.(context)) || {
      props: {},
    }) as GetServerSidePropsResult<
      RouteProps<I> & InferGetServerSidePropsType<F>
    >;
  };
}
