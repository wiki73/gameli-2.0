import { useState } from 'react';
import { supabase } from '../supabase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const signUp = async () => {
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      setMessage('Ошибка регистрации: ' + error.message);
      return;
    }

    try {
      await supabase.from('users').insert([
        {
          id: data.user.id, // совпадает с auth.users.id
          name: name.trim() || 'Без имени',
          exp: 0,
          money: 0,
        },
      ]);

      setMessage('Пользователь зарегистрирован успешно!');
      window.location.reload();
    } catch (err) {
      setMessage('Ошибка при добавлении в users: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <input
        onChange={e => setName(e.target.value)}
        placeholder='Имя'
        value={name}
      />
      <input
        onChange={e => setEmail(e.target.value)}
        placeholder='Email'
        value={email}
      />
      <input
        onChange={e => setPassword(e.target.value)}
        placeholder='Пароль'
        type='password'
        value={password}
      />
      <button
        onClick={signUp}
        type='button'
      >
        Зарегистрироваться
      </button>

      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default Register;
