import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/LoginForm.module.css';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authService.login({ email, password });
    if (success) {
      navigate('/management');
    } else {
      toast.error('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.formGroup}>
          <label htmlFor="exampleInputEmail1">Email:</label>
          <input
            type="email"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="exampleInputPassword1">Password:</label>
          <input
            type="password"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Submit
        </button>
        <div className={styles.registerLink}>
          <Link to="/register">Don't have an account? Register here</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
