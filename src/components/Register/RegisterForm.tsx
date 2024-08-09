import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/RegisterForm.module.css';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className={styles.registerFormContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2 className={styles.title}>Register</h2>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="username"
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
