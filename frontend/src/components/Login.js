import React, { useEffect, useState } from 'react';
import api from '../api';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import '../user.css';

export default function Login({ onLogin, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // ✅ Add the class to <body> when this component is mounted
  useEffect(() => {
    document.body.classList.add('user-page');
    return () => {
      document.body.classList.remove('user-page'); // clean up when leaving page
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      onLogin();
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="auth-container">
      <h2 className="gradient-text">Welcome Back</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Enter your username"
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </Form.Group>
        <Button type="submit" className="w-100 mb-3">Login</Button>
      </Form>
      <div className="switch-text">
        Don't have an account?{' '}
        <Button variant="link" onClick={switchToRegister}>
          Register here
        </Button>
      </div>
    </Container>
  );
}
