import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../../supabase';

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: {
          session: { user },
        },
      } = await supabase.auth.getSession();

      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('exp, money, level, name')
        .eq('id', user.id)
        .single();

      setUser({
        id: user.id,
        exp: data.exp,
        money: data.money,
        level: data.level,
        name: data.name,
      });
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

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export function useAuth() {
  return useContext(authContext);
}
