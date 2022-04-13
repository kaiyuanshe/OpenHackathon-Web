import { cache } from 'web-utility';
import { destroyCookie } from 'nookies';

import { User } from '../../../models/User';
import { safeAPI, readCookie, writeCookie, request, HTTPError } from '../core';

export default safeAPI(async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
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
      } catch {
        throw new HTTPError('Unauthorized', 401, {});
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

      return res.json({});
    }
  }
});

export const getClientSession = cache(async clean => {
  const user = await request<User>('user/session');

  setTimeout(clean, +new Date(user.tokenExpiredAt) - Date.now());

  return user;
}, 'Client Session');
