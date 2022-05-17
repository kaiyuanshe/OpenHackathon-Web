import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { getClientSession } from '../pages/api/user/session';

import { User } from '../models/User';
import { request } from '../pages/api/core';

type AuthContextProps = {
  user?: User;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  isLoggedIn: false,
  logout: async () => {},
});

export const AuthProvider = (props: PropsWithChildren<any>) => {
  const [state, setState] = useState<Omit<AuthContextProps, 'logout'>>({
    user: undefined,
    isLoggedIn: false,
  });

  useEffect(() => {
    const loadUserState = async () => {
      const storedUser = await getClientSession();
      if (storedUser) {
        setState({
          user: storedUser,
          isLoggedIn: true,
        });
      }
    };
    loadUserState();
  }, []);

  const logout = async () => {
    await request('user/session', 'DELETE');

    location.replace('/');
  };

  const contextValue: AuthContextProps = { ...state, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
