import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ResetIcon } from '@radix-ui/react-icons';
import { Card } from '../../common/Card/Card';
import { useAuth } from '../../../contexts/auth-context';
import { Button } from '../../common/Button/Button';
import { api } from '../../../api';
import { getColorBySubjectLevel } from '../../../constants/colors';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: api.signOut,
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
          <img
            alt='Profile'
            className={styles.userAvatar}
            src='/images/king.png'
          />
          <div
            className={styles.level}
            style={{
              boxShadow: `0 0 10px ${color}, inset 0 0 2px ${color}`,
            }}
          >
            {user?.level}
          </div>
        </div>
        <div className={styles.userInfo}>
          <p>Имя: {user?.name}</p>
          <p>Опыт: {user?.exp}</p>
          <Button onClick={handleLogout}>
            <ResetIcon /> Выйти
          </Button>
        </div>
      </div>
    </Card>
  );
};
