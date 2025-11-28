import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import {login} from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();

 const handleLogin = async ({ email, password }) => {
  try {
    const data = await login(email, password);
    localStorage.setItem("token", data.token);
    navigate("/home");
  } catch (err) {
    alert("Invalid credentials");
  }
};
  return (
    <LoginForm
      onLogin={handleLogin}
      onForgotPassword={() => navigate('/reset-password')}
      onBackToLanding={() => navigate('/')}
    />
  );
}
