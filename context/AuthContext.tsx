import {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getClientSession } from '../pages/api/user/session';

import { User } from '../models/User';

type AuthContextProps = {
  user?: User;
  isLoggedIn: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
  user: undefined,
  isLoggedIn: false,
  logout: () => {},
});

export const AuthProvider = (props: PropsWithChildren<any>) => {
  const [state, setState] = useState<Partial<AuthContextProps>>({
    user: undefined,
    isLoggedIn: false,
  });

  console.log('inside auth provider');
  useEffect(() => {
    const loadUserState = async (): Promise<void> => {
      console.log('inside async');
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

  const contextValue: AuthContextProps = { ...state };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
