import '@authing/native-js-ui-components/lib/index.min.css';

import { Guard, GuardEvents } from '@authing/native-js-ui-components';
import { FC } from 'react';

import sessionStore from '../../models/User/Session';

const title = process.env.NEXT_PUBLIC_SITE_NAME,
  AppId = process.env.NEXT_PUBLIC_AUTHING_APP_ID!;

export type AuthingGuardProps = Pick<GuardEvents, 'onLogin' | 'onLoginError'>;

const AuthingGuard: FC<AuthingGuardProps> = ({
  // @ts-ignore
  onLogin = profile => sessionStore.signIn(profile, true),
  onLoginError = console.error,
}) => (
  <div
    className="d-flex justify-content-center"
    ref={async target => {
      if (!target) return;

      const guard = new Guard(AppId, {
        target,
        title,
        logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg',
      });
      guard.on('login', onLogin);
      guard.on('login-error', onLoginError);
    }}
  />
);
export default AuthingGuard;
