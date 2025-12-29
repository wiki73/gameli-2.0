import { useState } from 'react';

import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('Вошёл:', data.user);
      navigate('/');
    }
  };

  return (
    <div>
      <Link to={'/register'}>Зарегаться</Link>
      <input
        onChange={e => setEmail(e.target.value)}
        placeholder='email'
        value={email}
      />

      <input
        onChange={e => setPassword(e.target.value)}
        placeholder='password'
        type='password'
        value={password}
      />

      <button onClick={signIn}>Войти</button>

      {error ? <p>{error}</p> : null}
    </div>
  );
}
