import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { register } from '../api/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async ({ email, password, firstName, lastName }) => {
    try {
        await register({
            imie: firstName,
            nazwisko: lastName,
            e_mail: email,
            haslo: password,
            haslo2: password,
        });

      alert('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
        console.log("Registration error:", err);
      alert("Registration failed. Maybe email already exists.");
    }
  };


  return (
    <RegistrationForm
      onRegister={handleRegister}
      onBackToLogin={() => navigate('/login')}
      onBackToLanding={() => navigate('/')}
    />
  );
}
