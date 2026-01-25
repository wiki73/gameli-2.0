import { AvatarIcon, ResetIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getColorBySubjectLevel, getQueryKey, QUERY_KEY_TYPES } from '@/consts';
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth';

export const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ type: QUERY_KEY_TYPES.SESSION, payload: {} }),
      });
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ type: QUERY_KEY_TYPES.USER, payload: {} }),
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const color = getColorBySubjectLevel(user?.level);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Профиль пользователя</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex gap-4'>
          <div className='relative w-fit'>
            <AvatarIcon className='size-16' />
            <div
              className='absolute -bottom-2 -right-2 rounded-full aspect-square w-8 flex justify-center items-center bg-card text-card-foreground'
              style={{
                border: `2px solid var(${color})`,
                boxShadow: `0 0 10px var(${color}), inset 0 0 2px var(${color})`,
              }}
            >
              {user?.level}
            </div>
          </div>
          <div>
            <CardDescription>{user?.name}</CardDescription>
            <CardDescription>Exp. {user?.exp}</CardDescription>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleLogout}
          size='sm'
          variant='destructive'
        >
          <ResetIcon /> Выйти
        </Button>
      </CardFooter>
    </Card>
  );
};
