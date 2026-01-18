import { AvatarIcon, ResetIcon } from '@radix-ui/react-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getColorBySubjectLevel } from '@/constants/colors';
import { api } from '../../../api/api';
import { useAuth } from '../../../contexts/auth-context';
import { Button } from '../../common/Button/Button';
import { Card } from '../../common/Card/Card';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: api.auth.signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const color = getColorBySubjectLevel(user?.level);

  return (
    <Card>
      <h1>Профиль</h1>
      <div className={styles.profile}>
        <div className={styles.userAvatarWrapper}>
          <AvatarIcon className={styles.userAvatar} />
          <div
            className={styles.level}
            style={{
              border: `2px solid var(${color})`,
              boxShadow: `0 0 10px var(${color}), inset 0 0 2px var(${color})`,
            }}
          >
            {user?.level}
          </div>
        </div>
        <div className={styles.userInfo}>
          <p>Имя: {user?.name}</p>
          <p>Опыт: {user?.exp}</p>
          <Button
            onClick={handleLogout}
            size='sm'
            variant='danger'
          >
            <ResetIcon /> Выйти
          </Button>
        </div>
      </div>
    </Card>
  );
};
