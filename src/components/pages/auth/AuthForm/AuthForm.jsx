import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api';
import { Spinner } from '../../../common/spinner/Spinner';
import styles from './AuthForm.module.css';

const TEXTS = {
  LOGIN: {
    TITLE: 'Войти',
    BTN_PRIMARY: 'Войти',
    BTN_SECONDARY: 'Зарегистрироваться',
  },
  REGISTER: {
    TITLE: 'Регистрация',
    BTN_PRIMARY: 'Зарегистрироваться',
    BTN_SECONDARY: 'Войти',
  },
  LABEL_NAME: 'Имя',
  LABEL_EMAIL: 'Почта',
  LABEL_PASSWORD: 'Пароль',
};

export const AuthForm = () => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState('LOGIN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const isLogin = mode === 'LOGIN';

  /* ---------- MUTATIONS ---------- */

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: err => setError(err.message),
  });

  const registerMutation = useMutation({
    mutationFn: api.register,
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

  const handleSubmit = e => {
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

  const handleChange = field => e => {
    setError(null);
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className={styles.auth}>
      <h1>{TEXTS[mode].TITLE}</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {!isLogin && (
          <>
            <label
              className={styles.label}
              htmlFor='name'
            >
              {TEXTS.LABEL_NAME}
            </label>
            <input
              autoComplete='name'
              className={styles.input}
              id='name'
              onChange={handleChange('name')}
              placeholder='Johnson'
              type='text'
              value={formData.name}
            />
          </>
        )}
        <label
          className={styles.label}
          htmlFor='email'
        >
          {TEXTS.LABEL_EMAIL}
        </label>
        <input
          autoComplete='email'
          className={styles.input}
          id='email'
          onChange={handleChange('email')}
          placeholder='johnson@email.com'
          type='email'
          value={formData.email}
        />
        <label
          className={styles.label}
          htmlFor='password'
        >
          {TEXTS.LABEL_PASSWORD}
        </label>
        <input
          autoComplete='current-password'
          className={styles.input}
          id='password'
          onChange={handleChange('password')}
          placeholder='******'
          type='password'
          value={formData.password}
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <button
          className={styles.primaryButton}
          disabled={isButtonDisabled}
          type='submit'
        >
          {isLoading ? <Spinner /> : null}
          {TEXTS[mode].BTN_PRIMARY}
        </button>
      </form>
      <button
        className={styles.secondaryButton}
        onClick={handleSwitchMode}
        type='button'
      >
        {TEXTS[mode].BTN_SECONDARY}
      </button>
    </div>
  );
};
