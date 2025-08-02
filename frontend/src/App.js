import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://employeefullstack.onrender.com/api/employees';

// Validation 
const employeeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  department: Yup.string().required('Department is required')
});

function App() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (currentEmployee) {
        // Update existing employee
        await axios.put(`${API_URL}/${currentEmployee._id}`, values);
        setSuccess('Employee updated successfully');
      } else {
        // Create new employee
        await axios.post(API_URL, values);
        setSuccess('Employee created successfully');
      }
      fetchEmployees();
      resetForm();
      setShowModal(false);
      setCurrentEmployee(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Operation failed');
    }
  };

  // Handle edit
  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccess('Employee deleted successfully');
        fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Delete failed');
      }
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Employee Management System</h1>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <h2>Employee List</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Employee
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(employee)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(employee._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No employees found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Employee Form Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setCurrentEmployee(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEmployee ? 'Edit Employee' : 'Add Employee'}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: currentEmployee?.name || '',
            email: currentEmployee?.email || '',
            department: currentEmployee?.department || ''
          }}
          validationSchema={employeeSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={values.department}
                    onChange={handleChange}
                    isInvalid={touched.department && !!errors.department}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.department}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                  setShowModal(false);
                  setCurrentEmployee(null);
                }}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  {currentEmployee ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Container>
  );
}

export default App;
