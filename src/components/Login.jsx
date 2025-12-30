import { useState } from 'react';

import { supabase } from '../supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div>
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

      <button
        onClick={signIn}
        type='button'
      >
        Войти
      </button>

      {error ? <p>{error}</p> : null}
    </div>
  );
};

export default Login;
