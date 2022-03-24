import dynamic from 'next/dynamic';
import '@authing/react-ui-components/lib/index.min.css';

const AppId = process.env.NEXT_PUBLIC_AUTHING_APP_ID!;

export const AuthingGuard = dynamic(
  async () => {
    const { SocialConnections, AuthingGuard } = await import(
      '@authing/react-ui-components'
    );
    return function AuthingWrapper() {
      return (
        <AuthingGuard
          config={{ socialConnections: [SocialConnections.Github] }}
          appId={AppId}
          onLogin={console.log}
        />
      );
    };
  },
  { ssr: false },
);

export default function SignInPage() {
  return <AuthingGuard />;
}
