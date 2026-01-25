import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import localforage from 'localforage';
import { api, supabase } from '@/api/api';
import type { User } from '@/api/auth/types';
import {
  getQueryKey,
  OFFLINE_MUTATIONS_TYPES,
  QUERY_KEY_TYPES,
} from '@/consts';
import type { Nullable } from '@/api/types';
import { enqueueMutation, setupOnlineSync } from '../query/persist';
import { AuthContext } from '.';

const USER_STORAGE_KEY = 'offline_user';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [offlineUser, setOfflineUser] = useState<Nullable<User>>(null);
  const [isOfflineUserLoading, setIsOfflineUserLoading] = useState(true);

  useEffect(() => {
    const loadOfflineUser = async () => {
      setIsOfflineUserLoading(true);
      const stored = await localforage.getItem<User>(USER_STORAGE_KEY);
      if (stored) setOfflineUser(stored);
      setIsOfflineUserLoading(false);
    };
    loadOfflineUser();
  }, []);

  const handleOfflineUser = async (user: Nullable<User>) => {
    await localforage.setItem(USER_STORAGE_KEY, user);
    setOfflineUser(user);
  };

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: getQueryKey({ type: QUERY_KEY_TYPES.SESSION, payload: {} }),
    queryFn: api.auth.session.get,
    staleTime: Infinity,
    retry: 1,
    initialData: null,
  });

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: getQueryKey({ type: QUERY_KEY_TYPES.USER, payload: {} }),
    queryFn: () => api.auth.user.get(session?.user?.id ?? ''),
    enabled: !!session?.user?.id && navigator.onLine,
    initialData: offlineUser,
  });

  const updateUserMutation = useMutation<
    { offline: boolean },
    unknown,
    { userId: string; data: Partial<User> }
  >({
    mutationFn: async ({ userId, data }) => {
      if (!navigator.onLine) {
        await enqueueMutation({
          type: OFFLINE_MUTATIONS_TYPES.UPDATE_USER,
          payload: { userId, data },
        });
        const prev = queryClient.getQueryData<User>(['user', userId]);
        if (prev) {
          const updated = { ...prev, ...data };
          queryClient.setQueryData(['user', userId], updated);
          await handleOfflineUser(updated);
        }
        return { offline: true };
      }

      const updatedUser = await api.auth.user.update({ userId, data });
      queryClient.setQueryData(['user', userId], updatedUser);
      await handleOfflineUser(updatedUser);
      return { offline: false };
    },
  });

  const handleUpdateUser = useCallback(
    (newUserData: Partial<User>) => {
      if (!session?.user?.id) return;

      updateUserMutation.mutate({
        userId: session.user.id,
        data: newUserData,
      });
    },
    [updateUserMutation, session?.user?.id],
  );

  useEffect(() => {
    const handleOnline = async () => {
      setupOnlineSync();

      if (session?.user?.id) {
        const freshUser = await api.auth.user.get(session.user.id);
        queryClient.setQueryData(['user', session.user.id], freshUser);
        if (freshUser) {
          await handleOfflineUser(freshUser);
        }
      }
    };
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient, session?.user?.id]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ type: QUERY_KEY_TYPES.SESSION, payload: {} }),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ type: QUERY_KEY_TYPES.USER, payload: {} }),
      });
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? offlineUser ?? null,
      isLoading: sessionLoading || userLoading || isOfflineUserLoading,
      error: sessionError || userError,
      updateUser: handleUpdateUser,
    }),
    [
      user,
      offlineUser,
      sessionLoading,
      userLoading,
      isOfflineUserLoading,
      sessionError,
      userError,
      handleUpdateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
