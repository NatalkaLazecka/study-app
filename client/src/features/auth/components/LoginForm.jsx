import { useState } from 'react';
import styles from '../styles/AuthForm.module.css';

export default function LoginForm({ onLogin, onForgotPassword, onBackToLanding }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin({ email, password });
  };

  return (
    <div className={styles['login-container']}>
      <h1 className={styles.title}>
        Welcome to <span className={styles['title-highlight']}>StudY</span>
      </h1>

      <form className={styles['login-box']} onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Log in</button>

        <p
          className={styles.forgot}
          onClick={onForgotPassword}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          Forgot your password?
        </p>
      </form>

      <button className={styles['back-btn']} onClick={onBackToLanding}>
        Back to main page
      </button>
    </div>
  );
}
