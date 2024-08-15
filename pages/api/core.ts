import { User } from '@kaiyuanshe/openhackathon-service';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { HTTPError } from 'koajax';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  compose,
  DataObject,
  githubOAuth2,
  JWTProps,
  Middleware,
} from 'next-ssr-middleware';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

import { ownClient } from '../../models/User/Session';

const { HTTP_PROXY } = process.env;

if (HTTP_PROXY) setGlobalDispatcher(new ProxyAgent(HTTP_PROXY));

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

const { JWT_SECRET = '' } = process.env;

export const jwtSigner: Middleware<DataObject, JWTProps<User>> = async (
  { req, res },
  next,
) => {
  const { token, JWT = '' } = req.cookies;

  try {
    const jwtPayload = verify(JWT, JWT_SECRET) as User;

    return { props: { jwtPayload } };
  } catch (error) {
    console.error((error as JsonWebTokenError).message, JWT);

    const nextResult = await next();

    if (
      ('redirect' in nextResult && nextResult.redirect) ||
      ('notFound' in nextResult && nextResult.notFound)
    )
      return nextResult;

    const { body } = await ownClient.post<User>('user/OAuth/GitHub', {
      accessToken: token,
    });
    res.setHeader('Set-Cookie', `JWT=${body!.token}; Path=/`);

    return { props: { jwtPayload: body! } };
  }
};

export const githubSigner = githubOAuth2({
  client_id: process.env.GITHUB_OAUTH_CLIENT_ID!,
  client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
  scopes: ['user:email', 'read:user', 'public_repo', 'read:project'],
});

export const sessionGuard = compose<DataObject, JWTProps<User>>(
  jwtSigner,
  githubSigner,
);
