import { useMemo, useState } from 'react';
import { supabase } from '../../../../supabase';
import { useAuth } from '../../../../contexts/auth-context';
import { api } from '../../../../api';
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
  const { handleUpdateUser } = useAuth();
  const [mode, setMode] = useState('LOGIN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const isLogin = mode === 'LOGIN';

  const isButtonDisabled = useMemo(() => {
    if (mode === 'LOGIN') {
      return !formData.email || formData.password.length < 6;
    }
    return (
      formData.name.length < 3 ||
      !formData.email ||
      formData.password.length < 6
    );
  }, [formData.name, formData.email, formData.password, mode]);

  const handleSwitchMode = () => {
    setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
  };

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      return;
    }
    await supabase.from('users').insert([
      {
        id: data?.user?.id,
        name: formData.name.trim() || 'Без имени',
        exp: 0,
        money: 0,
        level: 0,
      },
    ]);
    handleUpdateUser({
      id: data?.user?.id,
      name: formData.name.trim() || 'Без имени',
      exp: 0,
      money: 0,
      level: 0,
    });
  };

  const handleLogin = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    const { data } = await api.getUserById(user?.id);

    if (error) {
      setError(error.message);
      return;
    }

    handleUpdateUser({
      id: user?.id,
      name: data?.name,
      exp: data?.exp,
      money: data?.money,
      level: data?.level,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  const handleNameChange = e => {
    setError(null);
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };
  const handleEmailChange = e => {
    setError(null);
    setFormData(prev => ({ ...prev, email: e.target.value }));
  };
  const handlePasswordChange = e => {
    setError(null);
    setFormData(prev => ({ ...prev, password: e.target.value }));
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
              onChange={handleNameChange}
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
          onChange={handleEmailChange}
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
          onChange={handlePasswordChange}
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
