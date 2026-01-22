import { createContext, useContext } from 'react';
import type { User } from '@/api/auth/types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  updateUser: (newUserData: Partial<User>) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  updateUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
