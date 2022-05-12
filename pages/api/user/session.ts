import { cache } from 'web-utility';
import { HTTPError } from 'koajax';
import { destroyCookie } from 'nookies';
import { GetServerSidePropsContext } from 'next';

import { User } from '../../../models/User';
import { safeAPI, readCookie, writeCookie, request } from '../core';
import { NextApiResponse } from 'next';

export default safeAPI(async (req, res: NextApiResponse<User | undefined>) => {
  switch (req.method) {
    case 'GET':
      try {
        if (!readCookie(req, 'userId')) {
          return res.json(undefined);
        }
        const user = await request<User>(
          `user/${readCookie(req, 'userId')}`,
          'GET',
          undefined,
          { req, res },
        );
        return res.json({
          ...user,
          token: readCookie(req, 'token'),
        });
      } catch (error) {
        throw new HTTPError('Unauthorized', {
          ...(error as HTTPError),
          status: 401,
          statusText: 'Unauthorized',
        });
      }
    case 'POST': {
      const user = await request<User>('login', 'POST', req.body, {
        req,
        res,
      });
      writeCookie(res, 'token', user.token, user.tokenExpiredAt);
      writeCookie(res, 'userId', user.id!, user.tokenExpiredAt);

      return res.json(user);
    }
    case 'DELETE': {
      destroyCookie({ res }, 'token', { path: '/' });
      destroyCookie({ res }, 'userId', { path: '/' });

      return res.json({} as User);
    }
  }
});

export function withSession<
  T extends (context: GetServerSidePropsContext<any>) => Promise<any>,
>(handler?: T) {
  return (async context =>
    readCookie(context.req, 'token')
      ? handler?.(context) || { props: {} }
      : {
          redirect: {
            destination: '/user/sign-in',
            permanent: false,
          },
        }) as T;
}

export const getClientSession = cache(async clean => {
  const user = await request<User | undefined>('user/session');
  if (!user) {
    return;
  }
  setTimeout(clean, +new Date(user.tokenExpiredAt) - Date.now());

  return user;
}, 'Client Session');
