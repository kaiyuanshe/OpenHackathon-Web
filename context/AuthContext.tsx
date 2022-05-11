import { createContext, PropsWithChildren, useContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = (props: PropsWithChildren<any>) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
};
