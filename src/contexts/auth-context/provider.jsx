import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { api } from '../../api';
import { AuthContext } from './index';

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  /* ---------- SESSION QUERY ---------- */
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['session'],
    queryFn: api.getSession,
    staleTime: Infinity,
  });

  /* ---------- USER QUERY ---------- */
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: () => api.getUserById(session?.user?.id),
    enabled: !!session?.user?.id,
  });

  /* ---------- UPDATE USER ---------- */
  const updateUserMutation = useMutation({
    mutationFn: api.updateUser,
    onSuccess: data => {
      if (!session?.user?.id) return;
      queryClient.setQueryData(['user', session.user.id], prev => ({
        ...prev,
        ...data,
      }));
    },
  });

  const handleUpdateUser = useCallback(
    newUserData => {
      if (!session?.user?.id) return;

      updateUserMutation.mutate({
        userId: session.user.id,
        data: newUserData,
      });
    },
    [updateUserMutation, session?.user?.id],
  );

  /* ---------- AUTH STATE LISTENER ---------- */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    });

    return () => listener.subscription.unsubscribe();
  }, [queryClient]);

  /* ---------- ERROR HANDLING ---------- */
  useEffect(() => {
    if (userError) {
      // eslint-disable-next-line no-console
      console.error('User fetch error:', userError);
      queryClient.invalidateQueries(['session']);
    }
  }, [userError, queryClient]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isLoading: sessionLoading || userLoading,
      error: sessionError || userError,
      updateUser: handleUpdateUser,
    }),
    [
      user,
      sessionLoading,
      userLoading,
      sessionError,
      userError,
      handleUpdateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
