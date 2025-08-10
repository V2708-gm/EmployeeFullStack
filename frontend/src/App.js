import React, { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import api from './api';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeList from './components/EmployeeList';
import EmployeeFormModal from './components/EmployeeFormModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch employees');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setEmployees([]);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setSuccess('Employee deleted successfully');
        fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Delete failed');
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (currentEmployee) {
        await api.put(`/employees/${currentEmployee._id}`, employeeData);
        setSuccess('Employee updated successfully');
      } else {
        await api.post('/employees', employeeData);
        setSuccess('Employee created successfully');
      }
      setShowModal(false);
      setCurrentEmployee(null);
      fetchEmployees();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Operation failed');
    }
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <Register switchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={() => setIsLoggedIn(true)} switchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <Container className="mt-4">
      {/* Line 1: Centered EMS */}
      <h1 className="app-main-title-centered">Employee Management System</h1>

      {/* Line 2: Logout Button (right aligned) */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="danger" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </Button>
      </div>

      {/* Line 3: Employee List (left) + Add Employee (right) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="employee-list-title">Employee List</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          <FaUserPlus /> Add Employee
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {/* Employee Table */}
      <EmployeeList employees={employees} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal */}
      <EmployeeFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCurrentEmployee(null);
        }}
        onSubmit={handleSaveEmployee}
        employee={currentEmployee}
      />
    </Container>
  );
}

export default App;
