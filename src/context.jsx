import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getLevelByExp as calculateLevelByExp } from './constants/levelRanges';
import { supabase } from './supabase';

const Context = createContext();

export const Provider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [exp, setExp] = useState(0);
  const [money, setMoney] = useState(0);
  const [level, setLevel] = useState(0);

  const updateLevelByExp = useCallback(
    async expAmount => {
      const lev = calculateLevelByExp(expAmount);
      setLevel(lev);

      await supabase.from('users').update({ level: lev }).eq('id', userId);
    },
    [userId],
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const loadUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('exp, money, level')
        .eq('id', userId)
        .single();

      if (!error) {
        setExp(data.exp);
        setMoney(data.money);
        await updateLevelByExp(data.exp);
      }
    };

    loadUser();
  }, [updateLevelByExp, userId]);

  const addExp = useCallback(
    async amount => {
      const newExp = exp + amount;
      setExp(newExp);
      await updateLevelByExp(newExp);

      await supabase.from('users').update({ exp: newExp }).eq('id', userId);
    },
    [exp, updateLevelByExp, userId],
  );

  const addMoney = useCallback(
    async amount => {
      const newMoney = money + amount;
      setMoney(newMoney);

      await supabase.from('users').update({ money: newMoney }).eq('id', userId);
    },
    [money, userId],
  );

  const value = useMemo(
    () => ({
      exp,
      setExp,
      money,
      setMoney,
      addExp,
      addMoney,
      level,
      userId,
    }),
    [addExp, addMoney, exp, level, money, userId],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useUser() {
  return useContext(Context);
}
