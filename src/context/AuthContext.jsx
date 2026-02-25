import { createContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.currentUser().then(setUser).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    register: authApi.register,
    login: async (payload) => {
      const data = await authApi.login(payload);
      setUser(data);
      return data;
    },
    logout: async () => {
      await authApi.logout();
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
