import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <ForgotPasswordForm onBackToLogin={() => navigate('/login')} />
  );
}
