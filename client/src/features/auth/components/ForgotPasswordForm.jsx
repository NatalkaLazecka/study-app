import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from '../styles/AuthForm.module.css';
import { sendResetEmail, verifyToken, resetPassword } from '../api/authApi';

export default function ForgotPasswordForm({ onBackToLogin }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  useEffect(() => {
    if (!token) return;
    verifyToken(token).then((data) => {
      if (data.valid) {
        setIsResetMode(true);
        setEmail(data.email);
      } else {
        alert('Password reset link expired or invalid.');
      }
    });
  }, [token]);

  const handleSend = async (e) => {
    e.preventDefault();
    await sendResetEmail(email);
    alert('Reset email sent! Check your inbox.');
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      return alert('Passwords do not match!');
    }
    await resetPassword({ token, newPassword });
    alert('Password changed successfully! You can log in now.');
    onBackToLogin?.();
  };

  return (
    <div className={styles['login-container']}>
      {!isResetMode ? (
        <form className={styles['login-box']} onSubmit={handleSend}>
          <h2>Password reset</h2>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send link</button>
        </form>
      ) : (
        <form className={styles['login-box']} onSubmit={handleReset}>
          <h2>Set new password</h2>
          <label>New password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>Repeat password</label>
          <input
            type="password"
            placeholder="Repeat new password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
          <button type="submit">Save</button>
        </form>
      )}

      <button className={styles['back-btn']} onClick={onBackToLogin}>
        Back to login
      </button>
    </div>
  );
}
