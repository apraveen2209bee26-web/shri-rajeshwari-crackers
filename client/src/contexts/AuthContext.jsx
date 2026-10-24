import { createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '../api';
import { AUTH_STORAGE_KEY } from '../api/http';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : { token: null, user: null };
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getStoredAuth);
  const [loading, setLoading] = useState(Boolean(authState.token));

  useEffect(() => {
    if (authState.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!authState.token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getMe();
        setAuthState((current) => ({
          ...current,
          user: data.user,
        }));
      } catch (_error) {
        setAuthState({ token: null, user: null });
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const completeLogin = (data) => {
    setAuthState({
      token: data.token,
      user: data.user,
    });
    return data.user;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    toast.success(data.message);
    return completeLogin(data);
  };

  const login = async (payload) => {
    const data = await api.login(payload);
    toast.success(data.message);
    return completeLogin(data);
  };

  const loginAdmin = async (payload) => {
    const data = await api.loginAdmin(payload);
    toast.success(data.message);
    return completeLogin(data);
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    const data = await api.getMe();
    setAuthState((current) => ({
      ...current,
      user: data.user,
    }));
    return data.user;
  };

  const updateProfile = async (payload) => {
    const data = await api.updateProfile(payload);
    setAuthState((current) => ({
      ...current,
      user: data.user,
    }));
    toast.success(data.message);
    return data.user;
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isAuthenticated: Boolean(authState.token),
      loading,
      register,
      login,
      loginAdmin,
      logout,
      refreshUser,
      updateProfile,
    }),
    [authState, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

