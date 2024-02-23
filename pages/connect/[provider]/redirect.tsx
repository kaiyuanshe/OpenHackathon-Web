import { compose, errorLogger } from 'next-ssr-middleware';
import { FC } from 'react';
import { buildURLData } from 'web-utility';

import { SessionUser, strapiClient } from '../../../models/User/Session';

export const getServerSideProps = compose<{ provider: string }>(
  errorLogger,
  async ({ params, query, res }) => {
    const { body } = await strapiClient.get<{ jwt: string; user: SessionUser }>(
      `auth/${params!.provider}/callback?${buildURLData(query)}`,
    );
    res.setHeader('Set-Cookie', `token=${body!.jwt}; Path=/`);

    return { props: {}, redirect: { statusCode: 302, destination: '/' } };
  },
);

const ProviderRedirection: FC = () => <></>;

export default ProviderRedirection;
