import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (data) => {
    console.log('Registration data:', data);
    // tu możesz dodać logikę wysyłania do backendu
    navigate('/home');
  };

  return (
    <RegistrationForm
      onRegister={handleRegister}
      onBackToLogin={() => navigate('/login')}
      onBackToLanding={() => navigate('/')}
    />
  );
}
