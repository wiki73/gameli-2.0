import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { api, supabase } from '@/api/api';
import { User } from '@/api/auth/types';
import { AuthContext } from '.';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['session'],
    queryFn: api.auth.session.get,
    staleTime: Infinity,
  });

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: () => api.auth.user.get(session?.user?.id ?? ''),
    enabled: !!session?.user?.id,
  });

  const updateUserMutation = useMutation({
    mutationFn: api.auth.user.update,
    onSuccess: data => {
      if (!session?.user?.id) return;
      queryClient.setQueryData(['user', session.user.id], (prev: User) => ({
        ...prev,
        ...data,
      }));
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
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    });

    return () => listener.subscription.unsubscribe();
  }, [queryClient]);

  useEffect(() => {
    if (userError) {
      queryClient.invalidateQueries({ queryKey: ['session'] });
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
