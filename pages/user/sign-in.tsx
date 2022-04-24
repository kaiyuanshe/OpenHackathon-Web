import dynamic from 'next/dynamic';
import '@authing/native-js-ui-components/lib/index.min.css';

import PageHead from '../../components/PageHead';
import { request } from '../api/core';

const AppId = process.env.NEXT_PUBLIC_AUTHING_APP_ID!;

export const AuthingGuard = dynamic(
  async () => {
    const { Guard } = await import('@authing/native-js-ui-components');

    function signIn(target: HTMLElement) {
      return new Promise((resolve, reject) => {
        const guard = new Guard(AppId, {
          target,
          title: '开放黑客松',
          logo: 'https://hackathon-api.static.kaiyuanshe.cn/static/logo.jpg',
        });
        guard.on('login', resolve);
        guard.on('login-error', reject);
      });
    }

    return function AuthingWrapper() {
      return (
        <div
          className="d-flex justify-content-center"
          ref={async node => {
            if (!node) return;

            await request('user/session', 'POST', await signIn(node));

            location.replace('/');
          }}
        />
      );
    };
  },
  { ssr: false },
);

export default function SignInPage() {
  return (
    <>
      <PageHead title="登录" />
      {/* @ts-ignore */}
      <AuthingGuard />
    </>
  );
}
