import React, { useEffect } from 'react';
import { FaEdit, FaTrash, FaMemory } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmployeeList({ employees = [], onEdit, onDelete, fromCache }) {

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('employeeEvent', (event) => {
      if (event.type === 'created') {
        toast.success(`🆕 New employee: ${event.data.name}`);
      } else if (event.type === 'updated') {
        toast.info(`✏️ Employee updated: ${event.data.name}`);
      } else if (event.type === 'deleted') {
        toast.warn(`🗑️ Employee deleted (ID: ${event.data.id})`);
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="employee-app">
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />

      {fromCache && (
        <div className="cache-status">
          <span className="cache-indicator cached">
            <FaMemory /> Data served from cache
          </span>
        </div>
      )}
      
      <table className="employee-table">
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
            employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(emp)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => onDelete(emp._id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}