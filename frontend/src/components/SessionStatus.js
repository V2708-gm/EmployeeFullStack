// src/components/SessionStatus.js
import React, { useState, useEffect } from 'react';
import { Badge, Alert, Button } from 'react-bootstrap';
import { verifySession, logout } from '../services/auth';

export default function SessionStatus({ onLogout }) {
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const valid = await verifySession();
        setIsValid(valid);
      } catch (err) {
        setError('Session verification failed');
      }
    };
    checkSession();
  }, []);

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout(); // Call parent logout handler if provided
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Badge bg={isValid ? "success" : "secondary"}>
        {isValid ? "Session Active" : "Session Expired"}
      </Badge>
      {isValid && (
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </div>
  );
}