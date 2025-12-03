import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import { register } from '../api/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async ({ email, password }) => {
    try {
      // imię i nazwisko możesz dorobić w formularzu
      // await register({
      //   email,
      //   password,
      //   imie: "",        // ustaw jeśli dodasz pola
      //   nazwisko: ""    // ustaw jeśli dodasz pola
      // });

        await register({ email, password, imie: "", nazwisko: "" });

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
