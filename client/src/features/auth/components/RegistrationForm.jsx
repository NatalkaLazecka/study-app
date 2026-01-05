import {useState} from 'react';
import styles from '../styles/AuthForm.module.css';

export default function RegistrationForm({onRegister, onBackToLogin, onBackToLanding}) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (!firstName.trim() || !lastName.trim()) {
            alert('First name and last name cannot be empty!');
            return;
        }

        if (onRegister) onRegister({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email,
            password
        });
    };

    return (
        <div className={styles['login-container']}>
            <h1 className={styles.title}>
                Create <span className={styles['title-highlight']}>Account</span>
            </h1>

            <form className={styles['login-box']} onSubmit={handleSubmit}>
                <label>First name</label>
                <input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <label>Last name</label>
                <input
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label>Confirm password</label>
                <input
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>
            </form>

            <p
                className={styles.forgot}
                onClick={onBackToLogin}
                style={{cursor: 'pointer', textDecoration: 'underline'}}
            >
                Already have an account? Log in
            </p>

            <button className={styles['back-btn']} onClick={onBackToLanding}>
                Back to main page
            </button>
        </div>
    );
}
