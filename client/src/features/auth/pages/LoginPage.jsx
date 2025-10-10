import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (credentials) => {
    console.log('Login:', credentials);
    navigate('/home');
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onForgotPassword={() => navigate('/reset-password')}
      onBackToLanding={() => navigate('/')}
    />
  );
}
