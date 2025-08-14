import React, { useEffect, useState } from 'react';
import api from '../api';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import '../user.css';

export default function Register({ switchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('user-page');
    return () => {
      document.body.classList.remove('user-page');
    };
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, password });
      setSuccess('Registered successfully. You can now login.');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
      setSuccess(null);
    }
  };

  return (
    <Container className="auth-container">
      <h2 className="gradient-text">Create Account</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4" controlId="username"style={{ marginBottom: '15px' }}>
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
            placeholder="Choose a username "
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Create a password"
          />
        </Form.Group>
        <Button
          type="submit"
          className="w-100 mb-3"
          style={{ marginTop: '1rem' }}
        >
          Register
        </Button>
      </Form>
      <div className="switch-text">
        Already have an account?{' '}
        <Button variant="link" onClick={switchToLogin}>
          Login here
        </Button>
      </div>
    </Container>
  );
}
