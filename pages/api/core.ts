import { HTTPError } from 'koajax';
import { NextApiRequest, NextApiResponse } from 'next';
import { githubOAuth2 } from 'next-ssr-middleware';

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

export const githubSigner = githubOAuth2({
  client_id: process.env.GITHUB_OAUTH_CLIENT_ID!,
  client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
  scopes: ['user:email', 'read:user', 'public_repo', 'read:project'],
});
