import {useNavigate} from "react-router-dom";
import LoginForm from "../components/LoginForm";
import {login} from "../api/authApi";

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = async ({email, password}) => {
        try {
            await login(email, password);
            navigate("/home");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <LoginForm
            onLogin={handleLogin}
            onForgotPassword={() => navigate("/reset-password")}
            onBackToLanding={() => navigate("/")}
        />
    );
}
