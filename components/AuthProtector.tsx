import React, { PropsWithChildren, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { router } from 'next/client';

export const AuthProtector = async ({ children }: PropsWithChildren<any>) => {
  const { isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    await router.push('/');
  }
  return children;
};
