import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../supabase';
import { api } from '../../api';
import { AuthContext } from './index';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) return;

      const { data, error } = await api.getUserById(session.user.id);

      if (error) {
        await supabase.auth.signOut();
        return;
      }

      setUser(data);
    };

    getUser();
  }, []);

  const handleUpdateUser = useCallback(newUserData => {
    setUser(prev => ({ ...prev, ...newUserData }));
  }, []);

  const value = useMemo(
    () => ({ user, handleUpdateUser }),
    [user, handleUpdateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
