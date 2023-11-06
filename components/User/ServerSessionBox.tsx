import dynamic from 'next/dynamic';
import { JWTProps } from 'next-ssr-middleware';
import { FC, HTMLAttributes } from 'react';

const AuthingGuard = dynamic(() => import('./AuthingGuard'), { ssr: false });

export type ServerSessionBoxProps = HTMLAttributes<HTMLDivElement> & JWTProps;

export const ServerSessionBox: FC<ServerSessionBoxProps> = ({
  jwtPayload,
  children,
  ...props
}) => <div {...props}>{jwtPayload ? children : <AuthingGuard />}</div>;
