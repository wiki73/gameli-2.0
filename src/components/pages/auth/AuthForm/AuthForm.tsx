import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Nullable } from '@/api/types';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Input } from '@/components/common/Input/Input';
import { api } from '../../../../api/api';
import { Spinner } from '../../../common/spinner/Spinner';
import styles from './AuthForm.module.css';

const TEXTS = {
  LOGIN: {
    TITLE: 'Войти',
    BTN_PRIMARY: 'Войти',
    BTN_SECONDARY: 'К регистрации',
  },
  REGISTER: {
    TITLE: 'Регистрация',
    BTN_PRIMARY: 'Зарегистрироваться',
    BTN_SECONDARY: 'К входу',
  },
  LABEL_NAME: 'Имя',
  LABEL_EMAIL: 'Почта',
  LABEL_PASSWORD: 'Пароль',
};

type Mode = 'LOGIN' | 'REGISTER';

export const AuthForm = () => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<Mode>('LOGIN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<Nullable<string>>(null);

  const isLogin = mode === 'LOGIN';

  /* ---------- MUTATIONS ---------- */

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: err => setError(err.message),
  });

  const registerMutation = useMutation({
    mutationFn: api.auth.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: err => setError(err.message),
  });

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const isButtonDisabled = useMemo(() => {
    const formInvalid = isLogin
      ? !formData.email || formData.password.length < 6
      : formData.name.length < 3 ||
        !formData.email ||
        formData.password.length < 6;

    return formInvalid || isLoading;
  }, [formData, isLogin, isLoading]);

  /* ---------- HANDLERS ---------- */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      registerMutation.mutate({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
    }
  };

  const handleSwitchMode = () => {
    setError(null);
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    setMode(isLogin ? 'REGISTER' : 'LOGIN');
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Card className={styles.auth}>
      <h1>{TEXTS[mode].TITLE}</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {!isLogin && (
          <Input
            autoComplete='name'
            id='name'
            onChange={handleChange('name')}
            placeholder={TEXTS.LABEL_NAME}
            type='text'
            value={formData.name}
          />
        )}
        <Input
          autoComplete='email'
          id='email'
          onChange={handleChange('email')}
          placeholder={TEXTS.LABEL_EMAIL}
          type='email'
          value={formData.email}
        />
        <Input
          autoComplete='password'
          id='password'
          onChange={handleChange('password')}
          placeholder={TEXTS.LABEL_PASSWORD}
          type='password'
          value={formData.password}
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button
          disabled={isButtonDisabled}
          type='submit'
        >
          {isLoading ? <Spinner /> : null}
          {TEXTS[mode].BTN_PRIMARY}
        </Button>
      </form>
      <Button
        onClick={handleSwitchMode}
        variant='secondary'
      >
        {TEXTS[mode].BTN_SECONDARY}
      </Button>
    </Card>
  );
};
