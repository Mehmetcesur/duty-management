import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/RegisterForm.module.css';
import authService from '../../services/authService';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await authService.register({
        email,
        password,
        username,
      });

      if (response.status === 200 || response.status === 201) {
        console.log('User registered successfully:', response.data);
        navigate('/'); // Kayıt başarılıysa giriş sayfasına yönlendirin
      } else {
        console.error('Failed to register user:', response);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className={styles.registerFormContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2 className={styles.title}>Register</h2>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.registerButton}>Register</button>
        <div className={styles.loginLink}>
          <Link to="/">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
