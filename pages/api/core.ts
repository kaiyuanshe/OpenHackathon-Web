import { User } from '@kaiyuanshe/openhackathon-service';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { Context, Middleware, ParameterizedContext } from 'koa';
import JWT from 'koa-jwt';
import { HTTPError } from 'koajax';
import { DataObject } from 'mobx-restful';
import {
  compose,
  githubOAuth2,
  JWTProps,
  KoaOption,
  Middleware as SSRM,
  withKoa,
} from 'next-ssr-middleware';

import { JWT_SECRET } from '../../configuration';
import { VERCEL } from '../../configuration';
import { SessionModel } from '../../models/User/Session';

export type JWTContext = ParameterizedContext<
  { jwtOriginalError: JsonWebTokenError } | { user: { email: string } }
>;

export const parseJWT = JWT({
  secret: JWT_SECRET!,
  cookie: 'token',
  passthrough: true,
});

export const verifyJWT = JWT({ secret: JWT_SECRET!, cookie: 'token' });

export const safeAPI: Middleware<any, any> = async (context: Context, next) => {
  try {
    return await next();
  } catch (error) {
    if (!(error instanceof HTTPError)) {
      console.error(error);

      context.status = 400;

      return (context.body = { message: (error as Error).message });
    }
    const { message, response } = error;
    let { body } = response;

    context.status = response.status;
    context.statusMessage = message;

    if (body instanceof ArrayBuffer)
      try {
        body = new TextDecoder().decode(new Uint8Array(body));

        body = JSON.parse(body);
      } catch {
        //
      }
    console.error(JSON.stringify(body, null, 2));

    context.body = body;
  }
};

export const withSafeKoa = <S, C>(...middlewares: Middleware<S, C>[]) =>
  withKoa<S, C>({} as KoaOption, safeAPI, ...middlewares);

export const jwtSigner: SSRM<DataObject, JWTProps<User>> = async ({ req, res }, next) => {
  const { token, JWT = '' } = req.cookies;

  try {
    const jwtPayload = verify(JWT, JWT_SECRET!) as User;

    return { props: { jwtPayload } };
  } catch (error) {
    console.error((error as JsonWebTokenError).message, JWT);

    const nextResult = await next();

    if (
      ('redirect' in nextResult && nextResult.redirect) ||
      ('notFound' in nextResult && nextResult.notFound)
    )
      return nextResult;

    const user = await SessionModel.signInWithGitHub(token!);

    res.setHeader('Set-Cookie', `JWT=${user.token}; Path=/`);

    return { props: { jwtPayload: JSON.parse(JSON.stringify(user)) } };
  }
};

const client_id = process.env.GITHUB_OAUTH_CLIENT_ID!,
  client_secret = process.env.GITHUB_OAUTH_CLIENT_SECRET!;

export const ProxyBaseURL = 'https://test.hackathon.kaiyuanshe.cn/proxy';

export const githubSigner = githubOAuth2({
  rootBaseURL: VERCEL ? undefined : `${ProxyBaseURL}/github.com/`,
  client_id,
  client_secret,
  scopes: ['user:email', 'read:user', 'public_repo', 'read:project'],
});

export const sessionGuard = compose<DataObject, JWTProps<User>>(jwtSigner, githubSigner);
